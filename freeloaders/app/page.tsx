"use client"

import styled from "styled-components";
import MapView from "./components/mapView";
import Tabs from "./components/tabs";
import { useState } from "react";
import ListView from "@/app/components/listView";

const TabsWrapper = styled.div`
    position: absolute;
    top: 2.5%;
    left: 50%;
    z-index: 998;
`

export default function Home() {
    const [selected, setSelected] = useState(0)

    return (
        <>
            <TabsWrapper>
                <Tabs items={["Map", "List"]} selected={selected} setSelected={setSelected} accented={true} />
            </TabsWrapper>

            {selected == 0 ? <MapView /> : <ListView />}
        </>
    )
}
