import React from 'react';
import { Typography, Box, Container } from '@mui/material';
import { FaCloud } from 'react-icons/fa';

const Hero = () => (
  <Box
    sx={{
      backgroundColor: '#f0f2f5',
      padding: '50px 0',
      textAlign: 'center',
      minHeight: '50vh',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Container maxWidth="md">
      {/* <FaCloud style={{ fontSize: '100px', color: '#1890ff' }} /> */}
      <Typography variant="h2" component="h1" gutterBottom>
      Công Ty TNHH Dịch Vụ Và Thương Mại Hoàng Phúc Thanh
      </Typography>
      <Typography variant="h5" component="p">
        {/* Real-time air quality monitoring for a healthier environment. */}
      </Typography>
    </Container>
  </Box>
);

export default Hero;
