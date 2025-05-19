import { MdEdit, MdDelete } from 'react-icons/md';
import style from '../UserDashboard.module.css';

export default function AddressCard({ title, address }) {
  return (
    <div className={style.addressCard}>
      <div className={style.addressHeader}>
        <h3>
          <span className={style.addressTitle}>{title}</span>
        </h3>
        <div className={style.actions}>
          <button className={style.actionBtn} title="Edit">
            <MdEdit className={style.editIcon} />
          </button>
          <button className={style.actionBtn} title="Delete">
            <MdDelete className={style.deleteIcon} />
          </button>
        </div>
      </div>
      <div className={style.addressGrid}>
        <div className={style.addressField}>
          <span className={style.fieldLabel}>FullName:</span>
          <span className={style.fieldValue}>{address.userName}</span>
        </div>
        <div className={style.addressField}>
          <span className={style.fieldLabel}>Email:</span>
          <span className={style.fieldValue}>{address.email}</span>
        </div>
        <div className={style.addressField}>
          <span className={style.fieldLabel}>Phone:</span>
          <span className={style.fieldValue}>{address.phone}</span>
        </div>
        <div className={style.addressField}>
          <span className={style.fieldLabel}>Country:</span>
          <span className={style.fieldValue}>{address.country}</span>
        </div>
        <div className={style.addressField}>
          <span className={style.fieldLabel}>State:</span>
          <span className={style.fieldValue}>{address.state}</span>
        </div>
        <div className={style.addressField}>
          <span className={style.fieldLabel}>City:</span>
          <span className={style.fieldValue}>{address.city}</span>
        </div>
        <div className={style.addressField}>
          <span className={style.fieldLabel}>Address:</span>
          <span className={style.fieldValue}>{address.address}</span>
        </div>
      </div>
    </div>
  );
}