import React from 'react';
import { StyleSheet, View, ART, Dimensions, TouchableWithoutFeedback, Image, Button} from 'react-native';
import Svg, { Path, G, Line } from 'react-native-svg'

import resolveAssetSource from 'resolveAssetSource'
//import localImage from '../localImage.png'
//import localImage2 from '../localimage2.png'

import { connect } from 'react-redux';

import Columna from '../reducers.js';

import * as actions from '../actions.js';


const {
    Surface,
    Group,
    Pattern,
    Shape,
    Text,
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

/*
const data = [
    {frequency: 6, letter: 'capas'},
    {frequency: 3, letter: 'fosiles'},

];
*/

//const pattern = new  Pattern(resolveAssetSource(localImage),100,100,100,100)
//  const pattern2 = new Pattern(resolveAssetSource(localImage2),100,100,100,100)

class Bar extends React.Component {

    constructor(props) {
        super(props);
        this.createBarChart = this.createBarChart.bind(this);
        this.drawLine = this.drawLine.bind(this);            
        this.getRandomColor = this.getRandomColor.bind(this);
        this.getSum = this.getSum.bind(this);

        this.state = {
            columnas : this.props.columnas,
            data: this.props.capas
        }
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

    getSum(datos) {
        let accum = 0 ;
        datos.map(d => accum = accum + d.frequency )
        return accum
    }

    gatherLithography = (margin, height, width, x, y) => {
        let accumFreq = 0 ;
        let separadores=[];
        let images= (this.props.capas.map((capa) =>{ 
                accumFreq = accumFreq + capa.frequency
                let img1 = "../" + capa.lithography + ".png";
                //let simg1 = require(img1)
                console.log(img1);

                separadores.push(
                    <Group key={capa.letter} y={y(accumFreq-capa.frequency)-height}>
                                <Shape d={this.drawLine(width,0)}  stroke={colours.black} strokeWidth={3}/>
                                
                    </Group>)

                return (
                    <Image 
                            key = {capa.letter}
                            source={require('../localImage.png')} 
                            style={{
                                position:'absolute',
                                left: margin.left+5,
                                bottom: margin.bottom  + height - y(accumFreq-capa.frequency),
                                width: x.bandwidth()-5,
                                height: height - y(capa.frequency)
                            }}
                    />
                )
            })
        )

        return [images,separadores]

    } 

    render() {
        const screen = Dimensions.get('window');
        const margin = {top: 50, right: 25, bottom: 200, left: 30}
        const width = screen.width - margin.right - margin.left
        const height = screen.height - margin.top - margin.bottom

        const x = d3.scale.scaleBand()
            .rangeRound([0, width])
            .domain(this.props.columnas)

        let maxFrequency = this.getSum(this.props.capas);

        let y = d3.scale.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, maxFrequency+1])

        const firstLetterX = x(this.props.capas[0].letter)
        const secondLetterX = x(this.props.capas[1].letter)
        const lastLetterX = x(this.props.capas[this.props.capas.length - 1].letter)
        const labelDx = (secondLetterX - firstLetterX) / 2

        const bottomAxis = ticks(0, width, labelDx)
        const upperAxis = [firstLetterX - labelDx, firstLetterX + labelDx, firstLetterX + labelDx*2, firstLetterX + labelDx*3]

        let bottomAxisD = (d3.shape.line()
                                .x(d => d )
                                .y(() => 0)
                                (bottomAxis))
        const upperAxisD = d3.shape.line()
                                .x(d => d )
                                .y(() =>  y(maxFrequency+20) -  height)
                                (bottomAxis)
        const upper2AxisD = d3.shape.line()
                                .x(d => d )
                                .y(() =>  y(maxFrequency) -  height)
                                (bottomAxis)

        /* 
            Arreglo soble el que se mapea para los puntos de corte con Y
            ticks (inicio, fin, saltos)
        */
        const leftAxis = ticks(0, maxFrequency+1, maxFrequency)

        /*
            Retorna el path para una linea vertical posicionada en (x,y)
            donde x = xTranslation y y = las posiciones y sobre array
        */
        let leftAxisLine = (array, xTranslation) => (
                            d3.shape.line()
                            .x(() => xTranslation )
                            .y(d => y(d) - height)
                            (array)
                            )

        let verticalLine = (array, xTranslation) => (
                            leftAxisLine(array, xTranslation + x.bandwidth())
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



        let displayColumnas = (this.props.columnas.map((col) =>{ 
                console.log(col);
                return (
                        <Group key={col} >
                            <Shape stroke={colours.black} d={verticalLine(leftAxis, x(col))} key="-1"/>
                            <Text
                                          x={x(col) + 8}
                                          y={y(maxFrequency+15) - height}
                                          fill={colours.black}
                                          font="14px helvetica"
                                        >
                                          {col.toString()}
                                        </Text>

                        </Group>

            )})
        )

        
        let dummy = this.gatherLithography(margin, height, width, x, y);
        let imagenesCapa = dummy[0];
        let lineasSeparadoras = dummy[1];



        //console.log(width);
        //console.log('Ahora');
        //console.log(`El bandwidth vale ${x.bandwidth()}`);
        //this.props.columnas.map((d)=>{console.log(`${d} -- ${x(d)}`)});
        //console.log(`El labelDx vale ${labelDx}`)
        //console.log(this.props.columnas)
        return(
            <View>

            {imagenesCapa}

            <Surface width={screen.width} height={screen.height}>
                <Group x={margin.left} y={margin.top}>
                    <Group x={0} y={height}>
                        <Group key={-1}>
                            <Shape d={bottomAxisD} stroke={colours.black} key="-1"/>
                                    <Group
                                        x={x('capas') + labelDx}
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
                            <Shape stroke={colours.black} d={leftAxisLine(leftAxis, 0)} key="-1"/>
                            {
                                leftAxis.map((d, i) => (
                                    <Group x={0} y={y(d)-height} key={i + 1}>
                                        <Shape d={this.drawLine(notch, 0)} stroke={colours.black}/>
                                        {(d != maxFrequency+1) && (
                                        <Text
                                            fill={colours.black}
                                            x={-25}
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

                        {displayColumnas}

                        <Group key={-6}>
                            <Shape d={upperAxisD} stroke={colours.black} key="-1"/>
                                    <Group
                                        x={x('capas') + labelDx}
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
                                        x={x('capas') + labelDx}
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

                        {lineasSeparadoras}

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

const mapStateToProps = (state,ownProps) =>{
/**
using REDUX stores, it allows us to just access the reducer values       by going state.name. Notice how name is what is being exported in    the reducer above
**/
  return{
    nombreColumna: state.nombreColumna,
    columnas: state.columnas,
    capas: state.capas,
  }
}

const mapDispatchToProps = (dispatch) => {
 return {
   addColumn:(name)=>{
    dispatch(actions.addColumn(name))
   },
   saveName:()=>{
    dispatch(actions.saveName())
   },
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Bar);
