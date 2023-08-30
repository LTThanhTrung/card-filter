import Head from 'next/head'
import Card from '@/components/card'
import { Flex, Heading, Input, useColorMode, Text, SimpleGrid } from '@chakra-ui/react'
import parts from './parts.json'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { SunIcon } from '@chakra-ui/icons'
parts.sort((a, b) => a.part_id.localeCompare(b.part_id))

parts.map((item) => {
  item.enabled = false
})

export default function Home() {
  const [axieParts, setAxieParts] = useState(parts)
  const [missing, setMissing] = useState("0")
  const { toggleColorMode } = useColorMode()

  useEffect(() => {
    const result = axieParts.filter((item) => item.enabled == false);
    let items = {
      "back": 0,
      "mouth": 0,
      "eyes": 0,
      "ears": 0,
      "tail": 0,
      "horn": 0
    }

    for (let i = 0; i < result.length; i++) {
      items[result[i].type] = items[result[i].type] + 1
    }

    let message = "" + (items['back'] > 0 ? " Back: " + items['back'] : "")
      + (items['mouth'] > 0 ? " Mouth: " + items['mouth'] : "")
      + (items['eyes'] > 0 ? " Eyes: " + items['eyes'] : " ")
      + (items['ears'] > 0 ? " Ears: " + items['ears'] : "")
      + (items['tail'] > 0 ? " Tail: " + items['tail'] : "")
      + (items['horn'] > 0 ? " Horn: " + items['horn'] : "")

    setMissing(message)
  }, [axieParts])


  const fetchData = async (index = 0, address) => {
    await axios.post('/api/getParts', { index: index, address: address }).then(async (response) => {
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
        <Flex direction={'row'} align={'center'}>
          <Heading mr={4}>Card Filter</Heading>
          <SunIcon onClick={toggleColorMode} cursor={'pointer'}/>
        </Flex>
        <Text align={'center'}>Missing part: {missing}</Text>
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
