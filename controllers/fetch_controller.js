const {pool} = require('../db');



const fetchMasterData = async (req, res)=>{
    const {fromDate, toDate}=req.body;
    console.log("received Dates", fromDate, toDate);
    try {
        const query =`SELECT * FROM tb_master WHERE datetime >= $1 AND datetime <= $2`;

        const result= await pool.query(query,[fromDate, toDate]);
        res.status(200).json({
            message: 'Data fetched successfully',
            data: result.rows,
        });
    } catch (error) {
        console.error('❌ Fetch error:', error);
        res.status(500).json({ message: `Error: ${error.message}` });
    }
}

module.exports={fetchMasterData};