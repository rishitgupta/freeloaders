import React from "react";
import styled from "styled-components";

const ModalContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${(p) => p.theme.color.white};
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-family: ${(p) => p.theme.font.content};
  text-align: left;
  width: 250px;
  z-index: 1000;
`;

const ModalTitle = styled.h3`
  font-size: 1rem;
  font-weight: ${(p) => p.theme.weight.bold};
  color: ${(p) => p.theme.color.accent};
  margin-bottom: 1rem;
`;

const PinColorKey = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  p {
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
  }

  .color-box {
    width: 1rem;
    height: 1rem;
    border-radius: 4px;
  }

  .green {
    background-color: green;
  }

  .orange {
    background-color: orange;
  }

  .red {
    background-color: red;
  }
`;

const PinColorModal = () => {
  return (
    <ModalContainer>
      <ModalTitle>Pin Color Key</ModalTitle>
      <PinColorKey>
        <p>
          <span className="color-box green"></span> Ongoing
        </p>
        <p>
          <span className="color-box orange"></span> Starting in &lt; 2 hours
        </p>
        <p>
          <span className="color-box red"></span> Starting &gt; 2 hours
        </p>
      </PinColorKey>
    </ModalContainer>
  );
};

export default PinColorModal;
