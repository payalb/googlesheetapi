const {google} = require('googleapis');
const express= require('express')
const keys= require('./googlekey.json');
const SCOPE= "https://www.googleapis.com/auth/spreadsheets";

const app= express();
app.use(express.json());
const client= new google.auth.JWT(
    //https://developers.google.com/identity/protocols/oauth2/scopes
    keys.client_email, null, keys.private_key, [SCOPE] );
    client.authorize(function(err, tokens){ //get token for access.
        if(err){
            console.error(err.message);
            return;
        }
        console.log("Connected!");
        
    });
    const gsapi= google.sheets({version: 'v4', auth: client});
    let spreadsheetid="1Hpktb5N9y1R6OKSDdbtQrUMTIi43jYtXyJ8DKbK_mds";
    app.get("/createSpreadSheet",async function(req,res){    
        spreadsheetid= await accessgooglesheet(client);
        res.send(spreadsheetid);
    });

    app.post("/updateSpreadSheet",(req,res)=>{
        let data=req.body.data;
        console.log(data)
        const writeopt= {
            spreadsheetId:  spreadsheetid,//from spreadsheet url,
            range: 'Data',
            valueInputOption: 'USER_ENTERED',
            resource: {values: data}
        };
        let resp=  gsapi.spreadsheets.values.append(writeopt);
        console.log(JSON.stringify(resp));
        res.send(resp)
    });

    app.listen(3000);

    async function accessgooglesheet(cl){
        
        /*const resource = {
           ,
          };*/
          const request = {
            resource: {
                properties: {
                    title: "Data1"
                  }
            },
        
            auth: cl,
          };
          const response = (await gsapi.spreadsheets.create(request)).data;
          var spreadsheetid= response.spreadsheetId;
          return {"spreadsheetId": spreadsheetid}
          /*
        const opt= {
            spreadsheetId: '1Hpktb5N9y1R6OKSDdbtQrUMTIi43jYtXyJ8DKbK_mds' ,//from spreadsheet url,
            range: 'Data'
        };
        let data=  await gsapi.spreadsheets.values.get(opt);
        const dataArray= data.data.values
        console.log(JSON.stringify(dataArray));
        let newDataArray= dataArray.map(function(r){
             r.push(r[0]+ '-' + r[1]);
             return r;
        })
        console.log(`new aray : ${newDataArray}`)
        const writeopt= {
            spreadsheetId: '1Hpktb5N9y1R6OKSDdbtQrUMTIi43jYtXyJ8DKbK_mds' ,//from spreadsheet url,
            range: 'Data!F1',
            valueInputOption: 'USER_ENTERED',
            resource: {values: newDataArray}
        };
        //https://developers.google.com/sheets/api/reference/rest 
        let resp=  gsapi.spreadsheets.values.update(writeopt)
        
            // TODO: Change code below to process the `response` object:
            console.log(JSON.stringify(resp));
          */
        
    }

 