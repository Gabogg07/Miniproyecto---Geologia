import React from 'react';
import { StyleSheet, View, ART, Dimensions, TouchableWithoutFeedback, Image, Button, ScrollView} from 'react-native';
import Svg, { Path, G, Line } from 'react-native-svg'

import resolveAssetSource from 'resolveAssetSource'
//import localImage from '../localImage.png'
//import localImage2 from '../localimage2.png'

import { connect } from 'react-redux';

//import {ImagenesPatrones} from './imagenesPatrones.js'

import Columna from '../reducers.js';

import * as actions from '../actions.js';


const {
    Surface,
    Group,
    Pattern,
    Shape,
    Text,
    Rectangle
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
    brown: 'brown',
    red: 'red',
    yellow: 'yellow',
    orange: 'orange',
    pink: 'pink'
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
        console.log(datos);
        datos.map(d => accum = accum + d['frequency'] )
        return accum
    }

    gatherLithography = (margin, height, width, x, y) => {
        let accumFreq = 0 ;
        let separadores=[];
        let colores=[];
        let i = 0;
        let images= (this.props.capas.map((capa) =>{ 
                accumFreq = accumFreq + capa.frequency
                let img1 = ImagenesPatrones[capa.lithography]
                console.log('+++++++++++++++++++++')
                console.log(accumFreq);

                separadores.push(
                    <Group key={capa.letter} y={y(accumFreq-capa.frequency)-height}>
                                <Shape d={this.drawLine(width,0)}  stroke={colours.black} strokeWidth={3}/>
                                
                    </Group>)
                colores.push(
                    <View style={{
                                position:'absolute',
                                left: margin.left+5,
                                bottom: margin.bottom  + height - y(accumFreq-capa.frequency),
                                width: x.bandwidth()-5,
                                height: height - y(capa.frequency),
                                backgroundColor:this.getRandomColor(),
                                opacity:0.5
                            }}>
                    </View>

                )
                i = (i+1)%3 ; 

                return (
                    <Image 
                            key = {capa.letter}
                            source={img1} 
                            style={{
                                position:'absolute',
                                left: margin.left+5,
                                bottom: margin.bottom  + height - y(accumFreq-capa.frequency),
                                width: x.bandwidth()-5,
                                height: height - y(capa.frequency),
                            }}
                    />
                )
            })
        )

        return [images,separadores, colores]
    } 
    /***
    gatherColumnValues(height, x, y, verticalLine, leftAxis, maxFrequency) =>{
        this.props.columnas.map((columna)=>{

        })
    }***/

    gatherNotes = (height, x, y, verticalLine, leftAxis, maxFrequency) => {
        let accumFreq = 0 ;
        let separadores = [];
        let notes = (this.props.capas.map((capa) =>{ 
            accumFreq = accumFreq + capa.frequency

            separadores.push(
                <Group key={'notas'} >
                    <Shape stroke={colours.black} d={verticalLine(leftAxis, x('notas'))} key="-1"/>
                    <Text
                      x={x('notas') + 8}
                      y={y(accumFreq - capa.frequency)- height -20}
                      fill={colours.black}
                      font="14px helvetica"
                    >
                      {capa.note}
                    </Text>
                </Group>
            )
        }))
        return separadores
    }

    render() {
        console.log("ACA VIENE ---------")
        console.log(this.props.capas)
        console.log("ACA MURIO ---------")

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
        const secondLetterX = x(this.props.capas[0].letter)
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
                                .y(() =>  y(maxFrequency+1))
                                (bottomAxis)
        const upper2AxisD = d3.shape.line()
                                .x(d => d )
                                .y(() =>  y(maxFrequency) -  height)
                                (bottomAxis)

        /* 
            Arreglo soble el que se mapea para los puntos de corte con Y
            ticks (inicio, fin, saltos)
        */
        //const leftAxis = ticks(0, maxFrequency+1, (maxFrequency+1)/3)
        let leftAxis ;
        if(maxFrequency <15){
            leftAxis = ticks(0, maxFrequency+1, (maxFrequency+1)/2 )
        } else {
            if(maxFrequency > 100){
                leftAxis = ticks(0, maxFrequency+1, (maxFrequency+1)/10 )
            }else{
                leftAxis = ticks(0, maxFrequency+1, (maxFrequency+1)/8)
            }
        }

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
                                          y={y(maxFrequency)- height - 20}
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
        let colores = dummy[2];
        let notes = this.gatherNotes(height, x, y, verticalLine, leftAxis, maxFrequency);


        //console.log(width);
        //console.log('Ahora');
        //console.log(`El bandwidth vale ${x.bandwidth()}`);
        //this.props.columnas.map((d)=>{console.log(`${d} -- ${x(d)}`)});
        //console.log(`El labelDx vale ${labelDx}`)
        //console.log(this.props.columnas)
        // OJO: si agregamos un scrollview se descuadra el layout de las imagenes de imagenesCapa
        return(
  
                <View>
                    {imagenesCapa}
                    {colores}

                    <Surface width={screen.width} height={screen.height}>
                        <Group x={margin.left} y={margin.top}>

                            <Group x={0} y={height}>
                                {/*
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
                                */}
                                {/*Eje Y con los numeros*/}
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

                                <Group key={'Linea superior de titulos'} y={y(maxFrequency+1)-height}>
                                        <Shape d={this.drawLine(width,0)}  stroke={colours.black} strokeWidth={3}/>
                                        
                                </Group>
                                <Group key={'Subrayado de titulos'} y={y(maxFrequency)-height}>
                                        <Shape d={this.drawLine(width,0)}  stroke={colours.black} strokeWidth={3}/>
                                        
                                </Group>

                                {displayColumnas}

                                {lineasSeparadoras}
                                {notes}

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

const ImagenesPatrones = {
    601: require('../Patrones/601.png'),
    603: require('../Patrones/603.png'),
    605: require('../Patrones/605.png'),
    607: require('../Patrones/607.png'),
    608: require('../Patrones/608.png'),
    609: require('../Patrones/609.png'),
    611: require('../Patrones/611.png'),
    612: require('../Patrones/612.png'),
    613: require('../Patrones/613.png'),
    614: require('../Patrones/614.png'),
    616: require('../Patrones/616.png'),
    617: require('../Patrones/617.png'),
    618: require('../Patrones/618.png'),
    619: require('../Patrones/619.png'),
    620: require('../Patrones/620.png'),
    621: require('../Patrones/621.png'),
    622: require('../Patrones/622.png'),
    623: require('../Patrones/623.png'),
    624: require('../Patrones/624.png'),
    625: require('../Patrones/625.png'),
    626: require('../Patrones/626.png'),
    627: require('../Patrones/627.png'),
    628: require('../Patrones/628.png'),
    629: require('../Patrones/629.png'),
    630: require('../Patrones/630.png'),
    631: require('../Patrones/631.png'),
    632: require('../Patrones/632.png'),
    633: require('../Patrones/633.png'),
    634: require('../Patrones/634.png'),
    635: require('../Patrones/635.png'),
    636: require('../Patrones/636.png'),
    637: require('../Patrones/637.png'),
    638: require('../Patrones/638.png'),
    639: require('../Patrones/639.png'),
    640: require('../Patrones/640.png'),
    641: require('../Patrones/641.png'),
    642: require('../Patrones/642.png'),
    643: require('../Patrones/643.png'),
    644: require('../Patrones/644.png'),
    645: require('../Patrones/645.png'),
    646: require('../Patrones/646.png'),
    647: require('../Patrones/647.png'),
    648: require('../Patrones/648.png'),
    649: require('../Patrones/649.png'),
    651: require('../Patrones/651.png'),
    652: require('../Patrones/652.png'),
    653: require('../Patrones/653.png'),
    654: require('../Patrones/654.png'),
    655: require('../Patrones/655.png'),
    656: require('../Patrones/656.png'),
    657: require('../Patrones/657.png'),
    658: require('../Patrones/658.png'),
    659: require('../Patrones/659.png'),
    660: require('../Patrones/660.png'),
    661: require('../Patrones/661.png'),
    662: require('../Patrones/662.png'),
    663: require('../Patrones/663.png'),
    664: require('../Patrones/664.png'),
    665: require('../Patrones/665.png'),
    666: require('../Patrones/666.png'),
    667: require('../Patrones/667.png'),
    668: require('../Patrones/668.png'),
    669: require('../Patrones/669.png'),
    670: require('../Patrones/670.png'),
    671: require('../Patrones/671.png'),
    672: require('../Patrones/672.png'),
    674: require('../Patrones/674.png'),
    676: require('../Patrones/676.png'),
    677: require('../Patrones/677.png'),
    681: require('../Patrones/681.png'),
    684: require('../Patrones/684.png'),
    701: require('../Patrones/701.png'),
    702: require('../Patrones/702.png'),
    703: require('../Patrones/703.png'),
    704: require('../Patrones/704.png'),
    705: require('../Patrones/705.png'),
    706: require('../Patrones/706.png'),
    707: require('../Patrones/707.png'),
    708: require('../Patrones/708.png'),
    709: require('../Patrones/709.png'),
    710: require('../Patrones/710.png'),
    711: require('../Patrones/711.png'),
    712: require('../Patrones/712.png'),
    713: require('../Patrones/713.png'),
    714: require('../Patrones/714.png'),
    715: require('../Patrones/715.png'),
    716: require('../Patrones/716.png'),
    717: require('../Patrones/717.png'),
    718: require('../Patrones/718.png'),
    720: require('../Patrones/720.png'),
    722: require('../Patrones/722.png'),
    729: require('../Patrones/729.png'),
    731: require('../Patrones/731.png'),
    732: require('../Patrones/732.png'),
    733: require('../Patrones/733.png')
}


