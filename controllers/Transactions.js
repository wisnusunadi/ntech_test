import  jwt  from "jsonwebtoken";
import Users from "../models/UserModel.js";
import Transaction from "../models/Transaction.js";
import db from "../config/Database.js";


export const getBalance = async(req,res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                reject(new Error('Token tidak tidak valid atau kadaluwarsa'));
            }
            resolve(decoded);
        });
    });


    const user = await Users.findByPk(decoded.userId)

    res.status(200).json({
        status : 0 ,
      message: 'Get Balance Berhasil',
    data: {
      balance: user.balance,
    }
    });


   
}

    export const transaction = async(req,res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const {service_code} = req.body;
        const invoice_number = await generateInvoiceNumber();
        const now = new Date();

        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    reject(new Error('Token tidak tidak valid atau kadaluwarsa'));
                }
                resolve(decoded);
            });
        });

        const currentBalance = await db.query('SELECT  balance FROM users WHERE id =(:where)', {
            replacements: {
                where:  decoded.userId,  
              },
            type: db.QueryTypes.SELECT
          });
    
            const data = await db.query('SELECT  service_tarif,service_name FROM services WHERE service_code =(:where)', {
                replacements: {
                    where:  service_code,  
                  },
                type: db.QueryTypes.SELECT
              });

              if (data.length > 0) {
                if (currentBalance[0].balance <  data[0].service_tarif) {
                    return res.status(400).json({ status : 102 ,message: "Saldo Tidak Cukup" ,data: null});
                } else {


                    const updateBalance = Number(currentBalance[0].balance) - Number(data[0].service_tarif);


                    await Users.update({balance:updateBalance},{
                        where : {
                            id : decoded.userId
                        }
                    })
                
                    const dataTransaksi = {
                            user_id  : decoded.userId,
                            invoice_number  : invoice_number,
                            transaction_type  : 'PAYMENT',
                            description  :  data[0].service_name,
                            total_amount : data[0].service_tarif,
                            created_on : now
                    
                        }

                    await Transaction.create(dataTransaksi) 





                    return res.status(200).json({ status : 0 ,message: "Transaksi berhasil" ,data: {
                        invoice_number  : invoice_number,
                        transaction_type  : 'PAYMENT',
                        description  :  data[0].service_name,
                        total_amount : data[0].service_tarif,
                        created_on : now
                
                    }});
                }
            } else {
                return res.status(400).json({ status : 102 ,message: "Service ataus Layanan tidak ditemukan" ,data: null});
            }



    }
    
        export const history = async(req,res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const { limit = 10, offset = 0 } = req.query;

        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    reject(new Error('Token tidak tidak valid atau kadaluwarsa'));
                }
                resolve(decoded);
            });
        });
        
        const data = await db.query('SELECT invoice_number,transaction_type,description,total_amount,created_on FROM transactions WHERE user_id =(:where) LIMIT :limit OFFSET :offset', {
            replacements: {
                where:  parseInt(decoded.userId),  
                limit: parseInt(limit), 
                offset: parseInt(offset) 
              },
            type: db.QueryTypes.SELECT
          });

          return res.status(200).json({  status : 0 ,message: "Get History Berhasil" ,data: {offset,limit,records:data}});



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

async function generateInvoiceNumber() {
    const count = await Transaction.count();
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, '').slice(2); 
    const sequenceNumber = String(count + 1).padStart(3, '0');
    return `INV${dateString}-${sequenceNumber}`;
  }