import React, {useState, useEffect, useRef} from 'react'
import SliderItem from './SliderItem'
import styled from 'styled-components'

import {gsap} from 'gsap'
import {Draggable} from 'gsap/Draggable'
import {InertiaPlugin} from 'gsap/InertiaPlugin'

import {ReactComponent as Arrow} from '../slider/arrow.svg'

gsap.registerPlugin(Draggable, InertiaPlugin)


// function usePreviousState(value) {
      //       const ref = useRef();
      //       useEffect(() => {
      //             ref.current = value;
      //       });

      //       return ref.current;
      // }

      // let previousActive = usePreviousState(activeSlide);

const SliderComponent = ({sliderData}) => {

      const [snapArr, setSnapArr] = useState([]);
      const [activeSlide, setActiveSlide] = useState(0);
      const controller = useRef(null);
      
      const sliderContainer = useRef(null);

      // let draggerInstance = {};

      // RUN THIS ONCE YOU HAVE A REFERENCE TO THE CONTAINER AND ITS CHILDREN
      useEffect(() => {
            const sliderParent = sliderContainer.current
            const sliderChildren = sliderContainer.current.children;

            const singleChildrenHeight = sliderContainer.current.children[0].innerWidth;
            gsap.set(sliderParent, { width: sliderContainer.current.children.length * 600});
            gsap.set(sliderChildren, { width: singleChildrenHeight });

            let offsetsArr = [];

            for (let i = 0; i < sliderContainer.current.children.length; i++) {
                  if(i === 0) {
                        offsetsArr.push(sliderContainer.current.children[i].offsetLeft); 
                  } else {
                        offsetsArr.push(-sliderContainer.current.children[i].offsetLeft); 
                  }
                   
            }

            Draggable.create(sliderContainer.current, {
                        type: 'x',
                        inertia: true,
                        snap: offsetsArr,
                        bounds: '.gsap-drag',
                        allowNativeTouchScrolling: false,
                        zIndexBoost: false,
                        onDrag: function() {
                              // I need to track the position so that activeSlide gets updated
                              const endXTrack = Math.round(Math.abs(this.endX) / 600)
                              animate('dragger', endXTrack)
                        }
            });
            

            setSnapArr(offsetsArr);
            gsap.set(sliderParent, { x: offsetsArr[activeSlide] });   

      }, [sliderContainer]);


    
      const animate = (trigger, draggerHint) => {
          
            const maxNumSlides = sliderContainer.current.children.length - 1;

            if(trigger === 'dragger') {
                  setActiveSlide(draggerHint)
            }     

            if(trigger === 'leftArrow') {
                 // if goes below return
                 if(activeSlide === 0) {
                       return
                 }
                 gsap.to(sliderContainer.current, 0.3, { x: snapArr[activeSlide - 1]}); 
                 setActiveSlide(activeSlide - 1);
            }

            if(trigger === 'rightArrow') {
                  if(activeSlide  > maxNumSlides - 1) {
                        return
                  }
                  gsap.to(sliderContainer.current, 0.3, { x: snapArr[activeSlide + 1]}); 
                  setActiveSlide(activeSlide + 1);
            }
      }

      return (
            <StyledGsapDrag className="gsap-drag">
                  <StyledSliderContainer ref={sliderContainer}>
                        {sliderData.map((image) => {
                              return <SliderItem  key={image.id} url={`https://wild-cms.herokuapp.com${image.sliderImage.url}`}/>  
                        })} 
                  </StyledSliderContainer>
                  <StyledController ref={controller}>  
                        <StyledLeftArrow onClick={(e) =>  animate(e.currentTarget.id)}
                                         id="leftArrow">
                              <Arrow fill={'black'} height={10} width={30}/>
                        </StyledLeftArrow>
                        <StyledArrow id="rightArrow" onClick={(e) =>  animate(e.currentTarget.id) }>
                              <Arrow  height={10} fill={'black'} width={30}/>
                        </StyledArrow>
                  </StyledController>
            </StyledGsapDrag>
      )
}

const StyledGsapDrag = styled.section`
      max-width: 590px;
      max-height: 680px;
      overflow: hidden;
      position: relative;
`;

const StyledSliderContainer = styled.div`
      width: 100%;
      height: 100%;
      display: flex;
`;


const StyledController = styled.div`
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: 1;
      background-color: #fafafa;
      display: flex;
      align-items: center;
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
      border-left: 1px solid grey;
`;

export default SliderComponent