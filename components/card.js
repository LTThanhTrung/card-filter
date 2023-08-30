import { Link, Flex, Image, Tooltip } from "@chakra-ui/react"
import { useEffect, useState } from "react"
export default function Card(props) {
    const [item, setItem] = useState((props))
    useEffect(() => {
    }, [props])
    return (
        <Link href={`https://app.axieinfinity.com/marketplace/axies/?auctionTypes=Sale&sort=PriceAsc&parts=${item.part.part_id}`}>
            <Flex background={item.part.enabled ? 'green.200' : 'grey'} borderRadius={10} w={12} h={12} align={'center'} justify={'center'} >
                <Tooltip label={item.part.name} placement="top-start">
                    <Image alt={item.part.name} src={`https://cdn.axieinfinity.com/marketplace-website/asset-icon/parts/${item.part.part_id}.png`} w={10}></Image>
                </Tooltip>
            </Flex>
        </Link>
    )
}