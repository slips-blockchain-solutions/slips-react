import React from 'react';
import { Spin } from "antd";

export default function WhileLoading(Component) {
  return function WhileLoadingComponent({ isLoading, ...props }) {
    if (!isLoading) return <Component {...props} />;
    return (
      <Spin id="component-loader" tip="Loading..." />
    );
  };
}