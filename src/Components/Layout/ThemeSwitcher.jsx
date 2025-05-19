import React, { useContext } from 'react';
import ThemeContext from '../../shop/ThemeContext';
import { Button, ButtonGroup } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import style from "./Layout.module.css";
import { FaCheck } from 'react-icons/fa';

const ThemeSwitcher = ({toggle, show}) => {
  const { currentTheme, changeTheme, navPosition, changeNavPosition } = useContext(ThemeContext);

  const themes = [
    { name: 'black', label: 'Black', color: '#110014' },
    { name: 'blue', label: 'Blue', color: '#0056b3' },
    { name: 'cyan', label: 'Cyan', color: '#04a5ff' },
    { name: 'pink', label: 'Pink', color: '#ff04d5' },
    { name: 'purple', label: 'Purple', color: '#720088' },
    { name: 'red', label: 'Red', color: '#a96940' },
    { name: 'default', label: 'Default', color: '#ffa70f' },
    { name: 'green', label: 'Green', color: '#4c7c08' },
  ];
  const currentThemeColor = themes.find(theme => theme.name === currentTheme)?.color || '#ffa70f';

  return (
    <Offcanvas show={show} onHide={toggle} placement="end" > 
        <Offcanvas.Header closeButton={toggle}>
          <Offcanvas.Title>Theme Switcher</Offcanvas.Title>
        </Offcanvas.Header>
        <hr/>
        <Offcanvas.Body>
          <div className="theme-switcher mb-3">
            <h5 className={`${style.colorThemeSwitcherHeader} px-2 py-2 fst-italic`}>Select your preferred color</h5>
            <div className={`${style.colorCircles}`}>
              {themes.map(theme => (
                <div 
                  key={theme.name}
                  className={`${style.colorCircle} ${currentTheme === theme.name ? 'active' : ''} mx-2 my-2`}
                  style={{ backgroundColor: theme.color }}
                  onClick={() => changeTheme(theme.name)}
                  title={theme.label}
                >
                  {currentTheme === theme.name && <div className={`${style.checkMark}`}>✓</div>}
                </div>
              ))}
            </div>
            <hr/>
            <h5 className={`${style.colorThemeSwitcherHeader} px-2 py-2 fst-italic`}>Select Navigation Position</h5>
            <div className="d-flex justify-content-center flex-column m-auto align-items-center mt-3">
            <Button
                variant="outline-primary"
                onClick={() => changeNavPosition('relative')}
                className={`my-3 position-relative px-4 w-75 ${navPosition === 'relative' ? 'active' : ''}`}
                style={{
                  borderColor: currentThemeColor,
                  backgroundColor: navPosition === 'relative' ? currentThemeColor : 'transparent',
                  color: navPosition === 'relative' ? 'white' : currentThemeColor
                }}
              >
                Relative
                {navPosition === 'relative' && (
                  <span className="position-absolute d-flex align-items-center justify-content-center" 
                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                    <FaCheck />
                  </span>
                )}
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => changeNavPosition('fixed')}
                className={`position-relative px-4 w-75 ${navPosition === 'fixed' ? 'active' : ''}`}
                style={{
                  borderColor: currentThemeColor,
                  backgroundColor: navPosition === 'fixed' ? currentThemeColor : 'transparent',
                  color: navPosition === 'fixed' ? 'white' : currentThemeColor
                }}
              >
                Fixed
                {navPosition === 'fixed' && (
                  <span className="position-absolute d-flex align-items-center justify-content-center" 
                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                    <FaCheck />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ThemeSwitcher;
