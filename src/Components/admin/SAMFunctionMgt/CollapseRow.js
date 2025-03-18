import React, { Children, useEffect, useState, memo } from "react";
import { styled as styledMui } from "@mui/material/styles";
import { Collapse, IconButton, Container } from "@mui/material";
import ArrowRight from "@mui/icons-material/ArrowRight";
import EditIcon from "@mui/icons-material/Edit";
import AddButton from "@mui/icons-material/Add";
import styled from "styled-components";

const PREFIX = "CollapseRow";

const classes = {
  root: `${PREFIX}-root`,
};

const StyledCollapseContainer = styledMui(Container)({
  [`& .${classes.root}`]: {
    padding: "0 !important",
    transform: "rotate(0deg)",
    "&.MuiButtonBase-root": {
      transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      outline: "none",

      "&.disabled svg": {
        color: "rgba(0, 0, 0, 0.2)",
      },

      "&.rotate-90": {
        transform: "rotate(90deg)",
      },

      "&.edit-button": {
        marginLeft: "10px",
      },
    },
  },
});

const border = `
  border: 1px solid;
`;

const CollapseContainer = styled.div`
  flex: 1;
`;

const Title = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding-block: 10px;

  &:hover {
    background-color: #efefef;
  }

  > div:first-of-type {
    align-items: center;
    display: flex;
    gap: 10px;

    h6 {
      margin: 0;
    }
  }

  > div:first-of-type,
  > div:first-of-type button {
    cursor: ${({ pointer }) => (pointer ? "pointer" : "default")};
  }
`;

const AddIconButton = styled(AddButton)`
  color: #69b969;
  ${border}
`;

const EditIconButton = styled(EditIcon)`
  border-color: #00a0e9;
  color: #00a0e9;
  ${border}
`;

const CollapseRow = ({
  children,
  title = "",
  handleClickAdd,
  handleClickEdit,
  style = { maxWidth: "1300px" },
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isContentEmpty, setIsContentEmpty] = useState(true);

  const handleClickExpand = () => {
    setExpanded((prev) => !prev);
  };

  useEffect(() => {
    const count = Children.count(children);
    if (!count) {
      return;
    }
    const childCount = Children.count(children[0]);
    setIsContentEmpty(!childCount);
  }, [Children.count(children)]);

  return (
    <StyledCollapseContainer style={style}>
      <Title pointer={!isContentEmpty}>
        <div {...(!isContentEmpty && { onClick: handleClickExpand })}>
          <IconButton
            className={`${classes.root} ${expanded ? "rotate-90" : ""} ${
              isContentEmpty ? "disabled" : ""
            }`}
            aria-label={expanded ? "expand" : "collapse "}
            size="large"
          >
            <ArrowRight />
          </IconButton>
          <h6>{title}</h6>
        </div>
        <div>
          <IconButton
            className={classes.root}
            aria-label="add"
            onClick={handleClickAdd}
            size="large"
          >
            <AddIconButton />
          </IconButton>
          <IconButton
            className={`${classes.root} edit-button`}
            aria-label="edit"
            onClick={handleClickEdit}
            size="large"
          >
            <EditIconButton />
          </IconButton>
        </div>
      </Title>
      {!isContentEmpty && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {children}
        </Collapse>
      )}
    </StyledCollapseContainer>
  );
};

export default memo(CollapseRow);
