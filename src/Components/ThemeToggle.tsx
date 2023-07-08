import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Store/store";
import { toggleTheme } from "../features/themeSlice";
import { MdLightMode } from "react-icons/md";
import { BsMoonStarsFill } from "react-icons/bs";

const ThemeToggle: React.FC = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);

  const handleToggle = () => {
      document.body.style.color= 'red !important';
    dispatch(toggleTheme());
  };

  return (
    <div className="toggle-wrapper" style={{backgroundColor:theme==='dark'?'#20212C':'#F4F7FD'}}>
      <MdLightMode style={{fontSize:'20px',color:'#828FA3'}}/>

      <input
       id="checkbox"
       className="checkbox"
       type="checkbox"
       checked={theme==='dark'}
       onChange={handleToggle}
      />
      <label htmlFor="checkbox" className="checkbox-label">
        <span className="ball"></span>
      </label>
      <BsMoonStarsFill style={{fontSize:'18px',color:'#828FA3'}}/>
    </div>
  );
};

export default ThemeToggle;
