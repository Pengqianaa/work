import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Container, TableContent } from "src/Components/admin/common";
import { AddButton } from "src/Components/admin/common/StyledUnits";
import {
  CollapseRow,
  ModifySAMFunctionMgtModal,
} from "src/Components/admin/SAMFunctionMgt";
import { TABS, INIT_FORM } from "src/constants/admin/SAMFunctionMgt";
import styled from "styled-components";

const InlineRow = styled.div`
  padding-left: 20px;
`;

const Divider = styled.hr`
  margin-bottom: 0;
`;

const Add = styled(AddButton)`
  margin-bottom: 10px !important;
  min-width: 64px;
  width: 0;
`;

const callbackFunctionRow = (data, fn) => {
  return data?.map((_data) => {
    const { id, childs } = _data;
    const length = childs?.length;
    let children = null;
    if (length > 0) {
      children = length && callbackFunctionRow(childs, fn);
    }

    return (
      <InlineRow key={id}>
        <CollapseRow
          title={_data.functionName}
          handleClickEdit={() => fn(id, _data)}
          handleClickAdd={() => fn(null, _data)}
        >
          {children}
        </CollapseRow>
      </InlineRow>
    );
  });
};

const SamFunctionMgt = () => {
  const dispatch = useDispatch();
  const functions = useSelector((state) => state.functions.list);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INIT_FORM);

  useEffect(() => {
    if (!functions.length) {
      dispatch({ type: "getSAMFunctionList" });
    }
  }, []);

  const handleClickModify = (id, rest) => {
    setOpen(true);
    // when id is empty string which means it's create, when create pass level+1 and id as parentId
    const newData = id
      ? { id, ...rest }
      : {
          ...INIT_FORM,
          level: rest.level + 1,
          parentId: rest.id,
          areaDTOS: rest?.areaDTOS ?? [],
        };
    setFormData(newData);
  };

  return (
    <>
      <ModifySAMFunctionMgtModal
        key={open}
        open={open}
        setOpen={setOpen}
        formData={formData}
      />
      <Container title="samfunctionmgt" tabs={TABS}>
        <TableContent>
          <Add
            variant="contained"
            onClick={() => handleClickModify("", { id: null, level: 0 })}
          >
            <FormattedMessage id="adminCommon.add" />
          </Add>
          {functions?.map((el) => {
            const { id, childs } = el;

            return (
              <div key={id}>
                <CollapseRow
                  title={el.functionName}
                  handleClickEdit={() => handleClickModify(id, el)}
                  handleClickAdd={() => handleClickModify(null, el)}
                >
                  {callbackFunctionRow(childs, handleClickModify)}
                  <Divider />
                </CollapseRow>
              </div>
            );
          })}
        </TableContent>
      </Container>
    </>
  );
};

export default SamFunctionMgt;
