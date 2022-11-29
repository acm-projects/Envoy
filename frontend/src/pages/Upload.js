import Navbar from '../components/Navbar';
import './styles/Upload.css'
import UploadForm from '../components/UploadForm';
import UploadIcon from '../assets/uploadIcon.png';

export default function Upload(props) {
  return (
    <div>
      <Navbar />
      <UploadForm />
    </div>

  )
}