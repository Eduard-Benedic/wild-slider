import React, {useRef, useEffect} from 'react'
import PropTypes from 'prop-types'
import gsap from 'gsap/gsap-core'



const SliderItem = ({url}) => {
      const currentImage = useRef(null)
      
      useEffect(() => {
            gsap.to(currentImage.current, {opacity: 1, delay: 1})
      }, [currentImage])

      return (<img ref={currentImage} style={{width: '100%', objectFit: 'cover', opacity: 0}} alt="okay" src={url} />)
}


SliderItem.propTypes = {
      url: PropTypes.string.isRequired,   
}

export default SliderItem;

