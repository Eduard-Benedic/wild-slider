import React, {useState, useEffect, useRef} from 'react'
import SliderItem from './SliderItem'
import styled from 'styled-components'

import {gsap} from 'gsap'
import {Draggable} from 'gsap/Draggable'
import {InertiaPlugin} from 'gsap/InertiaPlugin'

import {ReactComponent as Arrow} from '../slider/arrow.svg'

gsap.registerPlugin(Draggable, InertiaPlugin)


const SliderComponent = ({sliderData}) => {


      function usePreviousState(value) {
            const ref = useRef();
            useEffect(() => {
                  ref.current = value;
            });
      
          
            return ref.current;
      }

      const [snapArr, setSnapArr] = useState([]);
      const [updateActiveSlideFromDraggable, setupdateActiveSlideFromDraggable] = useState(false);

      const [activeSlide, setActiveSlide] = useState(0);

      let previousActive = usePreviousState(activeSlide);

      const sliderContainer = useRef(null);

      const [draggerReference, setDraggerReference] = useState({});

      

      // RUN THIS ONCE YOU HAVE A REFERENCE TO THE CONTAINER AND ITS CHILDREN
      useEffect(() => {
            const sliderParent = sliderContainer.current
            const sliderChildren = sliderContainer.current.children;

            const singleChildrenHeight = sliderContainer.current.children[0].innerWidth;
            gsap.set(sliderParent, { width: sliderContainer.current.children.length * 600});
            gsap.set(sliderChildren, { width: singleChildrenHeight });

            let offsetsArr = [];

            for (let i = 0; i < sliderContainer.current.children.length; i++) {
                  if(i == 0) {
                        offsetsArr.push(sliderContainer.current.children[i].offsetLeft); 
                  } else {
                        offsetsArr.push(-sliderContainer.current.children[i].offsetLeft); 
                  }
                   
            }

            const dragger =   Draggable.create(sliderContainer.current, {
                  type: 'x',
                  inertia: true,
                  snap: offsetsArr,
                  bounds: '.gsap-drag',
                  allowNativeTouchScrolling: false,
                  zIndexBoost: false,
                  onDrag: ()  => {
                        const updateSlide = Math.round(Math.abs(dragger[0].x / 600));
                        setActiveSlide(updateSlide)
                  }
            });

            dragger[0].id = 'dragger'

            setDraggerReference(dragger[0]);
            
            setSnapArr(offsetsArr);
            gsap.set(sliderParent, { x: offsetsArr[0] });   

            gsap.to(sliderParent, {opacity: 1, duration: 1})
      }, [sliderContainer]);

      const animate = (e) => {

            const maxNumSlides = sliderContainer.current.children.length - 1;

            if(e.currentTarget.id === 'leftArrow') {
                 // if goes below return

                 if(activeSlide == 0) {
                       return
                 }
                 previousActive = activeSlide - 1;
                 setActiveSlide(previousActive);
            }

            if(e.currentTarget.id === 'rightArrow') {
                  // if goes past return
                  if(activeSlide + 1 > maxNumSlides) {
                        return
                  }
                  setActiveSlide(activeSlide + 1);
            }
      }

      
    

      useEffect(() => {
            if(updateActiveSlideFromDraggable) {
                  return
            } else {
                  gsap.to(sliderContainer.current, 0.3, { x: snapArr[activeSlide]}); 
            }

      } ,[activeSlide, updateActiveSlideFromDraggable]);

      return (
            <StyledGsapDrag className="gsap-drag">
      
                  <StyledSliderContainer ref={sliderContainer}>
                        {sliderData.map((image) => {
                              return <SliderItem  key={image.id} url={`https://pacific-earth-89422.herokuapp.com${image.sliderImage.url}`}/>  
                        })} 
                  </StyledSliderContainer>
                  <Controller>  
                        <StyledLeftArrow onClick={(e) =>  animate(e)}
                                         id="leftArrow">
                              <Arrow fill={'black'} height={10} width={30}/>
                        </StyledLeftArrow>
                        <StyledArrow id="rightArrow" onClick={(e) =>  animate(e) }>
                              <Arrow  height={10} fill={'black'} width={30}/>
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
    /* opacity: 0; */
`;

const StyledSliderContainer = styled.div`
   display: flex;
   
`;


const Controller = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  z-index: 100;

  background-color: #fafafa;
`

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
export default SliderComponent