import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import classNames from 'classnames';
import { MdOutlineViewInAr } from 'react-icons/md';

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-neutral-200">
      <button
        className={classNames(
          'w-full flex justify-between items-center p-4 transition-colors duration-300',
          { 'hover:bg-neutral-100 bg-white': !isOpen },
          { 'hover:bg-neutral-200 bg-neutral-100': isOpen },
        )}
        onClick={toggleAccordion}
      >
        <span className="text-sm lg:text-base font-semibold">
          <i>
            <MdOutlineViewInAr size={22} className="mr-3 inline-block" />
          </i>
          {title}
        </span>
        <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>
      {isOpen && (
        <div className="p-4 bg-white transition-all duration-500">
          <div className="text-neutral-600">{content}</div>
        </div>
      )}
    </div>
  );
};

const Accordion = ({ data = [] }) => {
  return (
    <div className="mx-auto">
      {data?.map((item, index) => (
        <AccordionItem key={index} title={item.title} content={item.content} />
      ))}
    </div>
  );
};

export default React.memo(Accordion);
