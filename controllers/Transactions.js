import  jwt  from "jsonwebtoken";
import Users from "../models/UserModel.js";
import Transaction from "../models/Transaction.js";


async function generateInvoiceNumber() {
    const count = await Transaction.count();
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, '').slice(2); 
    const sequenceNumber = String(count + 1).padStart(3, '0');
    return `INV${dateString}-${sequenceNumber}`;
  }

export const topUp = async(req,res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const {top_up_amount} = req.body;
    const invoice_number = await generateInvoiceNumber();
    const now = new Date();
 
    if (typeof top_up_amount !== 'number' || top_up_amount <= 0 || top_up_amount === '') {
        return res.status(400).json({status: 102, message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0' ,data:null});
    }


    const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                reject(new Error('Token tidak tidak valid atau kadaluwarsa'));
            }
            resolve(decoded);
        });
    });

    const user = await Users.findOne({ where: { id: decoded.userId }, attributes: ['balance'] });

    const updateBalance = Number(user.balance) + Number(top_up_amount);


    await Users.update({balance:updateBalance},{
        where : {
            id : decoded.userId
        }
    })

    await Transaction.create({
        user_id  : decoded.userId,
        invoice_number  : invoice_number,
        transaction_type  : 'TOPUP',
        description  : 'Top Up Balance',
        total_amount : top_up_amount,
        created_on : now

    }) 

    return res.json({status:0,message: "Top Up Balance Berhasil", data :{ balance: updateBalance} });
 
}