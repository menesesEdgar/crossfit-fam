import React from 'react';
import ImageViewer from '../ImageViewer/ImageViewer';
import { Badge, Card as FlowbiteCard } from 'flowbite-react';

const Card = ({ data = {}, showImage = false }) => {
  return (
    <FlowbiteCard className="w-full">
      <div className="w-full flex gap-2">
        {showImage && data.image && (
          <div className="w-24 h-24">
            <ImageViewer
              containerClassNames={'h-20 w-20'}
              images={[data?.image?.value]}
            />
          </div>
        )}
        <div className="flex flex-col">
          {Object.keys(data).map((key) => {
            if (key === 'title') {
              return (
                <h4 key={key} className="text-sm font-semibold text-orange-500">
                  {data[key].value}
                </h4>
              );
            }
            if (key === 'subtitle') {
              return (
                <h6 key={key} className="text-xs font-medium text-gray-600">
                  {data[key].value}
                </h6>
              );
            }
            if (key === 'tags') {
              return (
                <div key={key} className="w-full flex flex-wrap gap-1 pt-2">
                  {data[key].value.map((tag, index) => {
                    if (index > 2) return null;
                    return (
                      <Badge size={'xs'} key={index} color="indigo">
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
      <div className="grid grid-cols-2">
        {Object.keys(data).map((key) => {
          if (key === 'image') return null;
          if (key === 'actions') return null;
          if (key === 'title') return null;
          if (key === 'subtitle') return null;
          if (key === 'id') return null;
          if (key === 'tags') return null;
          return (
            <div key={key} className="mb-2">
              <h6 className="text-sm font-semibold text-gray-600 truncate">
                {data[key].key}
              </h6>
              <p className="text-sm font-light text-gray-800">
                {data[key].value}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col justify-between gap-3">
        {data?.actions && <>{data.actions.value}</>}
      </div>
    </FlowbiteCard>
  );
};

export default Card;
