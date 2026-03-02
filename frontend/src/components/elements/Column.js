import React from "react";
import Block from "./Block";

function Column(props) {
    let blocks = [];

    if (Array.isArray(props.blocks)) {
        props.blocks.forEach(function (element, index) {
            blocks.push({
                key: index,
                value: element
            });
        });
    }

    return (
        <>
            {blocks.map((block) => <Block key={block.key} block={block.value} />)}
        </>
    );
}

export default Column;