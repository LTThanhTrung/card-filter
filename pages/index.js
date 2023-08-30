import Head from 'next/head'
import Image from 'next/image'
import Card from '@/components/card'
import { Flex, Heading, Input, Box, Text, SimpleGrid } from '@chakra-ui/react'
import parts from './parts.json'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'

parts.map((item) => {
  item.enabled = false
})

export default function Home() {
  const [axieParts, setAxieParts] = useState(parts)

  useEffect(() => {

  }, [axieParts])


  const fetchData = async (index = 0, address) => {
    await axios.post('/api/getParts', { index: index, address: address }).then(async (response) => {
      console.log(response.data)
      let parts = response.data.parts
      let temp = axieParts
      for (let i = 0; i < parts.length; i++) {
        let itemIndex = temp.map(function (o) { return o.part_id }).indexOf(parts[i])
        if (itemIndex >= 0) {
          temp[itemIndex].enabled = true
        }
      }

      setAxieParts([...temp])

      if (response.data.hasNext) {
        console.log("HERE")
        await fetchData(index + 100, address)
      }
    })
  }

  const handleChange = (event) => {
    let address = event.target.value.replace('ronin:', '0x')
    if (ethers.isAddress(address)) {
      fetchData(0, address)
    }
  }


  return (
    <>
      <Head>
        <title>Filter Axie part</title>
        <meta name="description" content="Check which common part is missing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex justify={'center'} height={'100%'} align={'center'} direction={'column'}>
        <Heading>Card Filter</Heading>
        <Flex direction={'row'}>
          <Input w={300} placeholder='ronin address' mt={4} onChange={handleChange} />
        </Flex>
        <SimpleGrid columns={[6, 6, 18, 18]} spacing={4} mt={8}>
          {axieParts.map((item, id) => {
            return (
              <Card key={id} part={item}></Card>
            )
          })
          }
        </SimpleGrid>
      </Flex>
    </>
  )
}
