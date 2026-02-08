import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

interface mylink_prop {
  url: string;
  content: string | ReactElement;
}

function MyLink(item: mylink_prop) {
  return (
    <Link to={item.url} className=' select-none'>
      <li>{item.content}</li>
    </Link>
  );
}
export default MyLink;
