import React from 'react'
import * as d3 from 'd3'
import { ART } from 'react-native'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const { Surface, Group, Shape } = ART

const width = responsiveHeight(100)
const height = responsiveWidth(100)
const userPurchases = [
  {
    itemName: 'Mountain Dew',
    price: 3
  },
  {
    itemName: 'Shoes',
    price: 50
  },
  {
    itemName: 'Kit Kat',
    price: 1
  },
  {
    itemName: 'Taxi',
    price: 24
  },
  {
    itemName: 'Watch',
    price: 100
  },
  {
    itemName: 'Headphones',
    price: 15
  },
  {
    itemName: 'Wine',
    price: 16
  }
]

const sectionAngles = d3.pie().value(d => d.price)(userPurchases)

const path = d3.arc().outerRadius(100).padAngle(.05).innerRadius(60) ;

const colors = d3.scaleLinear().domain([0, userPurchases.length]).range([0, 255]);

export default class GraphScreen extends React.Component {
  render() {

    return (

      <Surface width={width} height={height}>
        <Group x={width/2} y={height/2}>
          {
            sectionAngles.map(section => (
            <Shape
               key={section.index}
               d={path(section)}
               stroke="#000"
               fill={`rgb(50,${section.index},255)`}
               strokeWidth={1}
             />
            ))
        }  
        </Group>
      </Surface>

    );
  }
}

