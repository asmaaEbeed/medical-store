import Styles from './Map.module.css';

export default function Map() {
  return (
    <div className={`${Styles.mapContainer} col-12  mb-3`}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110521.87483946555!2d31.223444899999996!3d30.05961815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14584083e5a47e7d%3A0xf7f0bba8f5d1d28c!2z2YXYrNmF2YjYsdin2K3YjCDYp9mE2YXZitmG2Kkg2KfZhNio2LLZitiMINin2YTYqNit2YXYrA!5e0!3m2!1sar!2seg!4v1707219234567!5m2!1sar!2seg"
        className={Styles.mapFrame}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
