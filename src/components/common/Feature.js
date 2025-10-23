import React from 'react';
import { Typography, Box, Container, Grid } from '@mui/material';
import { FaSmog , FaThermometerHalf, FaTint } from 'react-icons/fa';

const features = [
  { icon: <FaSmog  size={48} />, title: 'Pollution', description: 'Monitor pollution in real-time.' },
  { icon: <FaThermometerHalf size={48} />, title: 'Temperature', description: 'Get accurate temperature readings.' },
  { icon: <FaTint size={48} />, title: 'Humidity', description: 'Check the humidity levels instantly.' },
];

const Features = () => (
  <Box sx={{ padding: '50px 0', backgroundColor: '#ffffff' }}>
    <Container maxWidth="lg">
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box sx={{ textAlign: 'center', padding: '20px' }}>
              {feature.icon}
              <Typography variant="h6" component="h3" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1">{feature.description}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default Features;
