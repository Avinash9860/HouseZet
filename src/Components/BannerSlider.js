import { useTheme } from '@material-ui/core/styles';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);


const BannerSlider = (props) => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    return (
        <div >

            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {props.Images.map((step, index) => (
                    <div
                        key={step.label}
                        style={{
                            width: "100%",
                            height: "150px",
                            backgroundColor: "yellowgreen"
                        }}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <img style={{ width: "100%", height: "250px", objectFit: "scale-down", backgroundColor: step.background }} src={step.banner} alt="" />
                        ) : null}

                    </div>
                ))}
            </AutoPlaySwipeableViews>

        </div>
    );
}

export default BannerSlider
