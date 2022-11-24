import React from 'react'
import Navbar from '../components/Navbar';
import Video from '../components/video';
import Card from '../components/card';
import LeftMenu from '../components/LeftMenu';
import './styles/library.css'


const Library = () => {
  return (
    <div>
    <Navbar />
      <h1>Library page</h1>
    <Card />
    <Card />
    <Card />
    <LeftMenu />
    </div>
  )
}

/*
const videos = [
  {title: 'vid1', availableLanguages: 'English', Description: 'This is video 1.'},
  {title: 'vid2', availableLanguages: 'English', Description: 'This is video 2.'},
  {title: 'vid3', availableLanguages: 'English', Description: 'This is video 3.'},
  {title: 'vid4', availableLanguages: 'English', Description: 'This is video 4.'},
  {title: 'vid5', availableLanguages: 'English', Description: 'This is video 5.'}
]

function Library() {
  return (
    <div className="Library">
      {users.map((videos) => <Video title={videos.title} availableLanguages={videos.languages} job={user.job}/>)}
    </div>
  );
}
*/


export default Library
