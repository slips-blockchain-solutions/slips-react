import React, { useState, useEffect } from "react";

import { Menu } from "antd";
import { Link } from "react-router-dom";

export default function HorizontalMenu({items}){


    const [route, setRoute] = useState();
    useEffect(() => {
        setRoute(window.location.pathname)
    }, [setRoute]);

    if(!items){
        return(
            <div className="horizontal-menu">
                No Menu Items Found
            </div>
        )
    }
    return(
        <Menu style={{ textAlign:"center"}} className="horizontal-menu" selectedKeys={[route]} mode="horizontal">
            {items.map((item, key) => {                    
                return ( 
                    <Menu.Item key={key} style={{ index:"9"}} >
                        <Link key={key+"-item"} onClick={()=>{setRoute(item.path)}} to={item.path}>{item.name}</Link>
                    </Menu.Item>
                ) 
            })}
        </Menu>
    )
}