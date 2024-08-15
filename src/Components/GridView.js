import { Box, Typography } from '@material-ui/core'
import React from 'react'
import ProductView from './ProductView'

const GridView = (props) => {
    return (
        <Box width="300px" style={{background:props.background}} p="16px" mx="auto">
            <Typography variant="h5">{props.title}</Typography>
            <Box display="flex" p="16px" justifyContent="center">
                <ProductView />
                <ProductView />
            </Box>
            <Box display="flex" p="16px" justifyContent="center">
                <ProductView />
                <ProductView />
            </Box>
        </Box>
    );
};

export default GridView
