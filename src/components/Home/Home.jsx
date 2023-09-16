import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';

export const Home = () => {
  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log('Signed out successfully');
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign out</button>
      <h1 style={{fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px"}}>MISS YOU</h1>
      <h1 style={{fontWeight: 800, lineHeight: "1.2em", color: "white", backgroundColor: "#1971c2", width: "fit-content", paddingRight: "16px"}}>DIAMONDS AND RUST</h1>
      <p style={{width: "600px", fontWeight: 400, lineHeight: "1.5em"}}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>
    </div>
  );
};
