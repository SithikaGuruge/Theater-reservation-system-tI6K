import {connection} from '../index.js';


export const postTempPurchase = async (req, res, next) => {
    try {
        
        const { theatre_id, show_time_id, seats} = req.body;
        const [result] = await connection.query(
        'INSERT INTO temp_purchases (theatre_id, show_time_id, seats) VALUES (?, ?, ?)',
        [theatre_id, show_time_id, seats]
        );

    } catch (error) {
        next(error);
    }

}