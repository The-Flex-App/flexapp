import React from 'react';
import Grid from '@material-ui/core/Grid';
import Header from './components/header/Header';
import Projects from './components/projects/Projects';
import Videos from './components/videos/Videos';
import Footer from './components/Footer';

function App() {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Header />
      </Grid>
      <Grid item xs={12} className="app-wrapper">
        <div className="sidebar">
          <Projects />
        </div>
        <div className="content-area">
          <Videos />
        </div>
      </Grid>
      <Grid item xs={12}>
        <Footer />
      </Grid>
    </Grid>
  );
}

export default App;
