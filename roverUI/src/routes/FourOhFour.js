import React, { Component } from 'react';
import BaseModuleTemplate from '../templates/BaseModuleTemplate';
import FourOhFourIMG from '../../public/404ErrorImage.jpg'

class FourOhFour extends Component {
    render() {
        return (
            <BaseModuleTemplate>
               <img src={FourOhFourIMG}/>
            </BaseModuleTemplate>
        );
    }
}

export default FourOhFour;