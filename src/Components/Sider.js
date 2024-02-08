import React from 'react'
export default function Sider({isLoggedIn}){
    return(<div>
        { isLoggedIn &&
                <h2>This is inside sider</h2>
        }
        
    </div>)
}