// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios"

export default async function handler(req, res) {
    try {
        const { index, address } = req.body
        console.log(req.body)
        const query = {
            "query": `query MyQuery { axies( owner: \"${address}\" from: ${index} size: 100 sort: IdAsc ) { results { parts { id } } total }}`,
            "operationName": "MyQuery"
        }
    
        await axios.post('https://graphql-gateway.axieinfinity.com/graphql', query).then((response) => {
            let results = {
                parts: [],
                hasNext: index + 100 > response.data.data.axies.total ? false : true
            }
    
            let items = response.data.data.axies.results
            for (let i = 0; i < items.length; i++) {
                let parts = items[i].parts
                for (let j = 0; j < parts.length; j++) {
                    if (!results.parts.includes(parts[j].id)) {
                        results.parts.push(parts[j].id)
                    }
                }
            }
            res.status(200).json(results)
        })
    }

    catch(ex){
        res.status(500)
        console.log(ex)
    }
}
