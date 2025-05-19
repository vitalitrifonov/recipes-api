import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
import { toast } from "react-toastify";

// Funktsioon, mis autentib pildi üleslaadimise päringu serveri kaudu
const authenticator = async () => {
    try {
        // Teeb päringu upload autentimise endpointile
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);
        if (!response.ok) {
            // Kui server vastab veaga, logib veateate ja viskab vea
            const errorText = await response.text();
            console.error("Server error response:", errorText);
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        // Parsib serveri vastuse ja võtab vajalikud autentimise andmed välja
        const data = await response.json();
        const { signature, expire, token, publicKey } = data;
        return { signature, expire, token, publicKey };
    } catch (error) {
        // Logib vead ja viskab üldise autentimise vea
        console.error("Authentication error:", error);
        throw new Error("Authentication request failed");
    }
};

const Upload = ({ children, type, setProgress, setData }) => {
  // Ref, mis hoiab IKUpload komponendi DOM elemendi viidet
  const ref = useRef(null);

  // Vea käsitlemise funktsioon, näitab teavitust
  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };
  // Eduka üleslaadimise korral paneb tulemuse state'i
  const onSuccess = (res) => {
    console.log(res);
    setData(res);
  };
  // Kuvab üleslaadimise progressi protsendina
  const onUploadProgress = (progress) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  return (
    // ImageKit kontekst, kus antakse autentimisandmed ja url
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      {/* Peidetud failivalik IKUpload komponent */}
      <IKUpload
        useUniqueFileName
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
        ref={ref}
        accept={`${type}/*`}
      />
      {/* Kujundatud div, mis klikitakse ja käivitab faili valiku */}
      <div className="cursor-pointer" onClick={() => ref.current.click()}>
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;