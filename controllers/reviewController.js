const sql = require('mssql');
const { poolPromise } = require('../util/database')

const getReviews = async(req,res) => {
	try {
		const limit = req.params.pgsize, page = req.params.pgcnt, offset = (page - 1) * limit;
		const pool = await poolPromise;
		const result = await pool.request()
			.input('input_parameter', sql.Int, '')
			/* .query(`select a.ASIN, a.ProductId, count(*) as Count, 
			sum(CAST(a.Ratings AS int)) as Total, 
			avg(CAST(a.Ratings AS int)) as Avg, 
			b.Title, b.Image_link  
			from review a 
			LEFT JOIN product b 
			ON a.ProductId = b.ProductId
			group by a.ASIN, a.ProductId, b.Title, b.Image_link  
			having a.ASIN is not null
			ORDER BY a.ProductId ASC`) */
			.query(`select a.ASIN, a.ProductId,  
			sum(CAST(a.Ratings AS int)) as Total, 
			avg(CAST(a.Ratings AS int)) as Avg, 
			b.Title, b.Image_link,
			(select sum(CAST(t.Ratings AS int))  from review t where ASIN is not null and Date>= getdate() -41 and a.asin = t.asin) as 'total_7', 
			(select avg(CAST(t.Ratings AS int)) from review t where ASIN is not null and Date>= getdate() -41 and a.asin = t.asin) as 'avg_7',
			(select sum(CAST(u.Ratings AS int))  from review u where ASIN is not null and Date>= getdate() -71 and a.asin = u.asin) as 'total_30', 
			(select avg(CAST(u.Ratings AS int)) from review u where ASIN is not null and Date>= getdate() -71 and a.asin = u.asin) as 'avg_30', 
			b.Rating as Amazon_Rating 
			from review a, product b 
			where a.ProductId = b.ProductId 
			group by a.ASIN, a.ProductId, b.Title, b.Image_link, b.Rating   
			having a.ASIN is not null  
			order by a.ProductId 
			OFFSET ${offset} ROWS
			FETCH Next ${limit} ROWS ONLY`)

		res.json({
			status: 200,
			data: result.recordsets,
			message: "List fetched successfully"
		});
	} catch (err) {
		res.status(500)
		res.send(err.message)
	}
}

module.exports = {
	getReviews
}