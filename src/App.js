import React, {useEffect, useState} from 'react';
import './App.css';
import SliderComponent from './component/SliderComponent'





function App() {


    const [sliderData, setSliderData] = useState();
    useEffect(() => {
      const fetchData = async () => {
            const sliderQuery = `{
                        sliderPage {
                              sliderSection {
                                    id
                              sliderImageCaption
                                    sliderImage {
                                          id
                                          url
                                    }
                              }
                        }
            }`;

            const result = await  fetch('https://wild-cms.herokuapp.com/graphql', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ query: sliderQuery }),
                              }).then(res => {
                                    return res.json()
                              })
                            
            setSliderData(result.data.sliderPage.sliderSection);
      };
          fetchData();
      }, []);


  return (
  
      <div className="App">
            {sliderData &&  <SliderComponent  sliderData={sliderData} />}
      </div>
  );
}

export default App;
