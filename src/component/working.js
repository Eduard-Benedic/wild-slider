import React, {useState, useEffect, useRef} from 'react'
import SliderItem from './SliderItem'
import styled from 'styled-components'

import {gsap} from 'gsap'
import {Draggable} from 'gsap/Draggable'
import {InertiaPlugin} from 'gsap/InertiaPlugin'

import {ReactComponent as Arrow} from '../slider/arrow.svg'

gsap.registerPlugin(Draggable, InertiaPlugin)


const SliderComponent = ({sliderData}) => {

      const [draggable, instanciateDraggable] = useState({});
      let [activeSlide, setActiveSlide] = useState(0);
      let [offsetBy, setOffsetBy] = useState([0]);
      let sliderContainer = useRef(null);
      // ========== Instanciate Draggable  ==============

      
      useEffect(() => {
            // Only instanciate it once
            const draggableInstance = Draggable.create(sliderContainer.current, {
                  type: 'x',
                  inertia: true,
                  snap: offsetBy[0],
                  // snap: sliderProps.offsets,
                  onDrag: () => {
                        
                  },
                  bounds: '.gsap-drag',
                  allowNativeTouchScrolling: false,
                  zIndexBoost: false
            })
            instanciateDraggable(draggableInstance);
           
            //===== PARENT FOR EACH SLIDER IMAGE
            const sliderParent = sliderContainer.current
            const sliderChildren = sliderContainer.current.children;

            gsap.set(sliderParent, { width: sliderContainer.current.children.length * 600});
            gsap.set(sliderChildren, { width: 600 });
            
            let offsetsArr = [];

            for (let i = 0; i < sliderContainer.current.children.length; i++) {
                  if(i == 0) {
                        offsetsArr.push(sliderContainer.current.children[i].offsetLeft);
                  } 
                        offsetsArr.push(-sliderContainer.current.children[i].offsetLeft);
                  
                
            }
            instanciateDraggable({...draggable, snap: offsetsArr})

            gsap.set(sliderParent, { x: offsetsArr[0] });
                
      }, [sliderData]);

      // ===== TRIGGERS ANIMATION on Active Slide change ==========
      useEffect(() => {
            const maxNumTracker = sliderContainer.current.children.length;

            if(activeSlide && activeSlide > 0 ) {
                  gsap.to(sliderContainer.current, 0.5, { x: draggable.snap[activeSlide] });
            } 
            if(activeSlide >  maxNumTracker) {
                  setActiveSlide(0)
            }
            if(activeSlide < 0 || activeSlide > maxNumTracker) {
                  return 
            }
         
      }, [activeSlide]);


      return (
            <StyledGsapDrag className="gsap-drag">
                  <StyledSliderContainer ref={sliderContainer}>
                        {sliderData.map((image) => {
                        return <StyledSliderImage key={image.id}>
                                    <SliderItem url={`http://localhost:1337${image.sliderImage.url}`}/>
                              </StyledSliderImage>
                        })} 
                  </StyledSliderContainer>
            
                  <Controller>
                        <StyledLeftArrow onClick={() => {setActiveSlide(activeSlide - 1)}} 
                                         id="leftArrow">
                              <Arrow fill={'black'} height={10} width={20}/>
                        </StyledLeftArrow>
                        <StyledArrow id="rightArrow" onClick={() => {setActiveSlide(activeSlide + 1)}}>
                              <Arrow  height={10} fill={'black'} width={20}/>
                        </StyledArrow>
                  </Controller>
            </StyledGsapDrag>
      )
}

const StyledGsapDrag = styled.section`
    max-width: 600px;
    max-height: 680px;
    overflow: hidden;
    position: relative;
`;

const StyledSliderContainer = styled.div`
   display: flex;
`;

const StyledSliderImage = styled.div`
    height: 100%;
    display: flex;
    align-content: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    position: relative;
    float: left;
`;


const StyledArrow = styled.button`
      display: inline-block;
      padding: 2rem;
      border: none;
      outline: none;
      font-weight: 300;
      cursor: pointer;

`;

const StyledLeftArrow = styled(StyledArrow)`
      transform: rotate(180deg);
      border: 1px;
      border-color: black;


`


const Controller = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  background-color: #fafafa;
`



export default SliderComponent