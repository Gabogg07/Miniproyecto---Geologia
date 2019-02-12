import React from 'react';
import { StyleSheet, View, ART, Dimensions, TouchableWithoutFeedback, Image} from 'react-native';
import resolveAssetSource from 'resolveAssetSource'
import localImage from '../localImage.png'
import localImage2 from '../localimage2.png'


const {
    Surface,
    Group,
    Rectangle,
    ClippingRectangle,
    LinearGradient,
    Shape,
    Text,
    Path,
    Transform,
    Pattern
} = ART;

import {
    max,
    ticks
} from 'd3-array'

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as format from 'd3-format';
import * as axis from 'd3-axis';
import * as path from 'd3-path';
const d3 = {
    scale,
    shape,
    format,
    axis,
    path,
};

import {
    scaleLinear,
    scaleBand,
    scaleTime
}  from 'd3-scale';

const colours = {
    black: 'black',
    blue: 'steelblue',
    brown: 'brown'
}

const data = [
    {frequency: 6, letter: 'a'},
    {frequency: 3, letter: 'b'},

];

const pattern = new  Pattern(resolveAssetSource(localImage),100,100,100,100)
const pattern2 = new Pattern(resolveAssetSource(localImage2),100,100,100,100)

export default class Bar extends React.Component {

    constructor(props) {
        super(props);
        this.createBarChart = this.createBarChart.bind(this);
        this.drawLine = this.drawLine.bind(this);            
        this.getRandomColor = this.getRandomColor.bind(this);
        this.getSum = this.getSum.bind(this);
    };

    static navigationOptions = {
    title: 'Columna',
    };

    getRandomColor() {
        return '#' + Math.random().toString(16).substr(-6);
    }               

    drawLine(startPoint, endPoint) {
        var path = d3.path.path();
        path.lineTo(startPoint, endPoint);
        return path;
    }

    createBarChart(x, y, w, h) {
        var path = d3.path.path();
        path.rect(x, y, w, h);
        return path;
    }

    getSum(data) {
        let accum = 0 ;
        data.map(d => accum = accum + d.frequency )
        return accum
    }

    render() {
        const screen = Dimensions.get('window');
        const margin = {top: 50, right: 25, bottom: 200, left: 25}
        const width = screen.width - margin.left - margin.right
        const height = screen.height - margin.top - margin.bottom

        const x = d3.scale.scaleBand()
            .rangeRound([0, width])
            .domain(data.map(d => d.letter))

        let maxFrequency = this.getSum(data);

        let y = d3.scale.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, maxFrequency+1])

        const firstLetterX = x(data[0].letter)
        const secondLetterX = x(data[1].letter)
        const lastLetterX = x(data[data.length - 1].letter)
        const labelDx = (secondLetterX - firstLetterX) / 2

        const bottomAxis = [firstLetterX - labelDx, firstLetterX + labelDx, firstLetterX + labelDx*2, firstLetterX + labelDx*3]
        const upperAxis = [firstLetterX - labelDx, firstLetterX + labelDx, firstLetterX + labelDx*2, firstLetterX + labelDx*3]

        let horizontalLine = (array, ) => (d3.shape.line()
                                .x(d => d + labelDx)
                                .y(() => 0)
                                (array))

        let bottomAxisD = (d3.shape.line()
                                .x(d => d + labelDx)
                                .y(() => 0)
                                (bottomAxis))
        const upperAxisD = d3.shape.line()
                                .x(d => d + labelDx)
                                .y(() =>  y(maxFrequency+1) -  height)
                                (upperAxis)
        const upper2AxisD = d3.shape.line()
                                .x(d => d + labelDx)
                                .y(() =>  y(maxFrequency) -  height)
                                (upperAxis)

        /* 
            Arreglo soble el que se mapea para los puntos de corte con Y
            ticks (inicio, fin, saltos)
        */
        const leftAxis = ticks(0, maxFrequency+1, maxFrequency)

        /*
            Retorna el path para una linea vertical posicionada en (x,y)
            donde x = xTranslation y y = las posiciones y sobre array
        */
        let verticalLine = (array, xTranslation) => (
                            d3.shape.line()
                            .x(() => bottomAxis[0] + xTranslation)
                            .y(d => y(d) - height)
                            (array)
                            )
        /*
            Sustituidas por vertical line, usando como argumentos:
                array = leftAxis
                xTranslation = La posicion en X donde debe comenzar
        const leftAxisD = d3.shape.line()
                            .x(() => bottomAxis[0] + labelDx)
                            .y(d => y(d) - height)
                            (leftAxis)
        const left2AxisD = d3.shape.line()
                            .x(() => bottomAxis[0] + labelDx *3+5)
                            .y(d => y(d) - height)
                            (leftAxis)
        const left3AxisD = d3.shape.line()
                            .x(() => bottomAxis[0] + labelDx *4 +5)
                            .y(d => y(d) - height)
                            (leftAxis)
        */

        const rightAxisD = d3.shape.line()
                            .x(() => width)
                            .y(d => y(d) - height)
                            (leftAxis)
        const notch = 5
        const labelDistance = 9
        const emptySpace = "";

        let columna = (data.map((d, i) => (
                                <TouchableWithoutFeedback key={i} >
                                    <Shape
                                        d={this.createBarChart(x('a'), y(d.frequency) - height, x.bandwidth(), height - y(d.frequency))}
                                        fill={pattern}
                                        >
                                    </Shape>
                                </TouchableWithoutFeedback>
                            ))

            )



        return(
            <View>
            <Image source={require('../localImage.png')} 
                                style={{
                                    position:'absolute',
                                    left: margin.left+5,
                                    bottom: margin.bottom,
                                    width: labelDx,
                                    height: height - y(6)
                                }}
                                />
            <Image source={require('../localimage2.png')} 
                                style={{
                                    position:'absolute',
                                    left: margin.left+5,
                                    bottom: margin.bottom + height - y(6),
                                    width: labelDx,
                                    height: height - y(3)
                                }}
                                />

            <Surface width={screen.width} height={screen.height}>
                <Group x={margin.left} y={margin.top}>
                    <Group x={0} y={height}>
                        <Group key={-1}>
                            <Shape d={bottomAxisD} stroke={colours.black} key="-1"/>
                                    <Group
                                        x={x('a') + labelDx}
                                        y={0}
                                        key={3 + 1}
                                    >
                                        <Shape d={this.drawLine(0, notch)}  stroke={colours.black}/>
                                        <Text
                                          y={labelDistance}
                                          fill={colours.black}
                                          font="25px helvetica"
                                        >
                                          {emptySpace}
                                        </Text>
                                    </Group>
                              
                        </Group>
                        <Group key={-2} >
                            <Shape stroke={colours.black} d={verticalLine(leftAxis, labelDx)} key="-1"/>
                            {
                                leftAxis.map((d, i) => (
                                    <Group x={0} y={y(d)-height} key={i + 1}>
                                        <Shape d={this.drawLine(notch, 0)} stroke={colours.black}/>
                                        {(d != maxFrequency+1) && (
                                        <Text
                                            fill={colours.black}
                                            x={-15}
                                            y={-labelDistance}
                                            font="18px helvetica"
                                        >
                                            {d + emptySpace}
                                        </Text>
                                        )}
                                    </Group>
                                ))
                            }
                        </Group>
                        <Group key={-3} >
                            <Shape stroke={colours.black} d={verticalLine(leftAxis, labelDx*2 +5)} key="-1"/>
                            <Text
                                          x = {5}
                                          y={y(maxFrequency+1) - height}
                                          fill={colours.black}
                                          font="14px helvetica"
                                        >
                                          Columna
                                        </Text>

                        </Group>
                        <Group key={-4} >
                            <Shape stroke={colours.black} d={verticalLine(leftAxis, labelDx*3 +5)} key="-1"/>
                            <Text
                                          x={labelDx + 8}
                                          y={y(maxFrequency+1) - height}
                                          fill={colours.black}
                                          font="14px helvetica"
                                        >
                                          Fosil
                                        </Text>

                        </Group>
                        <Group key={-5} >
                            <Shape stroke={colours.black} d={rightAxisD} key="-1"/>
                            <Text
                                          x={labelDx*2 + 8}
                                          y={y(maxFrequency+1) - height}
                                          fill={colours.black}
                                          font="14px helvetica"
                                        >
                                          Notas
                                        </Text>

                        </Group>
                        <Group key={-6}>
                            <Shape d={upperAxisD} stroke={colours.black} key="-1"/>
                                    <Group
                                        x={x('a') + labelDx}
                                        y={0}
                                        key={3 + 1}
                                    >
                                        <Shape d={this.drawLine(0, notch)}  stroke={colours.black}/>
                                        <Text
                                          y={labelDistance}
                                          fill={colours.black}
                                          font="25px helvetica"
                                        >
                                          {emptySpace}
                                        </Text>
                                    </Group>
                              
                        </Group>
                        <Group key={-7}>
                            <Shape d={upper2AxisD} stroke={colours.black} key="-1"/>
                                    <Group
                                        x={x('a') + labelDx}
                                        y={0}
                                        key={3 + 1}
                                    >
                                        <Shape d={this.drawLine(0, notch)}  stroke={colours.black}/>
                                        <Text
                                          y={labelDistance}
                                          fill={colours.black}
                                          font="25px helvetica"
                                        >
                                          {emptySpace}
                                        </Text>
                                    </Group>
                              
                        </Group>

                        <Group key={'LineaSeparadora'} y={y(6)-height}>
                            <Shape d={this.drawLine(width,0)}  stroke={colours.black} strokeWidth={3}/>

                        </Group>
                        <Group key={'LineaSeparadora2'} y={y(6)-height}>
                            <Shape d={this.drawLine(width,0)}  stroke={colours.black} strokeWidth={3}/>
                            
                        </Group>

                    </Group>

                </Group>
            </Surface>


            </View>
        )
    }
}

const styles = {
  container: {
    margin: 20,
  },
  label: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: 'normal',
  }
};


