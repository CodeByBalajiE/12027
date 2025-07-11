const express=require('express')
const app=express()
const path=require('path')
const port=5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/hostname:port',(req,res)=>{
    res.send(`<h1>Welcome to the server running on port ${port}</h1>`)
})

//develop a http url shortener microservice
app.post('/shorturls',(req,res)=>{
    let {url,validity,shortCode}=req.body;
    if(!url||url.trim()===''){
        return res.status(400).send({error:"URL is required"});
    }
    url=url.trim();

    if(!shortCode){
        shortCode=Math.random().toString(36).substring(2, 8);
    }
    let expiry=new Date();
    if(validity&&!isNaN(validity)){
        expiry.setMinutes(expiry.getMinutes()+Number(validity));
    }
    else{
        expiry.setDate(expiry.getDate()+1);
    }
    const shortlink=`http://localhost:${port}/${shortCode}`;
    res.send({
        shortlink,
        expiry: expiry.toISOString()
    });
})
//(post) log middleware in the api is http://20.244.56.144/evaluation-service/logs with parameters are Log(stack,level,package,messaage)
app.post('/evaluation-service/logs',(req,res)=>{
    const {stack,level,package,message}=req.body;
    if(!stack || !level || !package || !message){
        return res.status(400).send({error:"All fields are required"});
    }
    console.log(`Log received: ${stack}, ${level}, ${package}, ${message}`);
    res.send({status:"Log received successfully"});
})

//retrieve shortened URL from above shortened URL service and response is number of time url is accessed and original URL relation
app.get('/shorturls/:shortCode',(req,res)=>{
    const shortCode=req.params.shortCode;
    const originalUrl = `http://example.com/original/${shortCode}`;
    const accessCount = Math.floor(Math.random() * 100); // Mock access count

    res.send({
        originalUrl,
        accessCount
    });
})
app.listen(port,()=>{
    console.log("server running");
})