import React, { useState, useEffect, useCallback } from "react";
import { useFullScreen } from "hooks/screen";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { Button, TextField } from "@mui/material";
import {
  GET_ALL_CHILD_CATE,
  CHECK_SLUG_CATEGORY,
} from "api/graphql/query/category";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "api/graphql/mutation/categories";
import style from "./style.module.scss";

import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";
import className from "classnames";
import { confirmAlert } from "react-confirm-alert";
export default function CategoryPicker({ preload=[],onClose, onSelect, current = [] }) {
  const [cateList, setCate] = useState(preload);
  useFullScreen();
  const onSelectCate = (cate) => {
    setCate((old) => {
      if (cate?.id) {
        const newLists = [
          ...old.slice(0, Math.max(0, cate.depth)),
          { ...cate },
        ];
        return newLists;
      }
      const newLists = [...old.slice(0, Math.max(0, cate.depth))];
      return newLists;
    });
  };

  return (
    <div className={style.container}>
      <div className={style.main}>
        <div className="right-aligned-flex p-sm">
          <p>
            {cateList.map((e, index) => (
              <span>
                {e.name}
                {index + 1 !== cateList.length ? <span>{">"}</span> : <></>}
              </span>
            ))}
          </p>
          <Button color="primary" variant="outlined" onClick={()=>{
            onSelect(cateList)
            onClose()
          }}>
            Chọn
          </Button>
          <span className="p-sm"></span>
          <Button color="secondary" variant="outlined" onClick={onClose}>
            Đóng
          </Button>
        </div>

        <div className={style.panels}>
          <Panel
            depth={0}
            onSelectCate={onSelectCate}
            selected={cateList[0]?.id ?? -1}
          />

          {cateList.map((c, i) => (
            <Panel
              selected={cateList[i + 1]?.id ?? -1}
              depth={c.depth + 1}
              parent_id={c.id}
              onSelectCate={onSelectCate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const Panel = ({ depth, parent_id, onSelectCate, selected }) => {
  const { loading, data, refetch } = useQuery(GET_ALL_CHILD_CATE, {
    variables: {
      input: {
        depth,
        parent_id: parent_id ?? undefined,
      },
    },
    fetchPolicy: "no-cache",
  });
  const [showUpdate, setShow] = useState(false);
  const [type, setType] = useState("create");
  const [preload, setPreload] = useState({
    id: -1,
    name: "",
    slug: "",
  });
  const onDeleteCate = (id) => {
    if (parseInt(id) === parseInt(selected)) {
      onSelectCate({ depth: depth - 1 });
    }
    toast("xóa danh mục thành công", { type: toast.TYPE.SUCCESS });
    refetch();
  };
  const onUpdateCate = (updated) => {
    if (selected === updated.id) {
      onSelectCate(updated);
    }

    refetch();
  };
  const onOpenUpdate = useCallback(() => {
    setShow(true);
  }, []);
  const onCloseUpdate = useCallback(() => {
    setShow(false);
  }, []);
  if (loading) return <p>...</p>;

  if (data) {
    return (
      <div className={style.panel}>
        {data?.getCategory?.map((e) => (
          <Item
            checked={selected === e.id}
            key={e.id}
            cate={e}
            onSelectCate={onSelectCate}
            onDeleteSuccess={onDeleteCate}
            openUpdate={() => {
              setType("update");
              setPreload({
                id: e.id,
                name: e.name,
                slug: e.slug,
              });
              onOpenUpdate();
            }}
          />
        ))}
        <CateMutation
          preload={preload}
          type={type}
          on={showUpdate}
          onClose={onCloseUpdate}
          onOpen={() => {
            setType("create");
            setPreload({ name: "", slug: "" });
            onOpenUpdate();
          }}
          onSuccess={refetch}
          onUpdateCate={onUpdateCate}
          parent_id={parent_id}
          depth={depth}
        />
      </div>
    );
  }
};
const CateMutation = ({
  type,
  onSuccess,
  parent_id,
  depth,
  preload = false,
  on = false,
  onOpen,
  onClose,
  onUpdateCate,
}) => {
  const [checkSlug, { data: dataSlug }] = useLazyQuery(CHECK_SLUG_CATEGORY, {
    fetchPolicy: "no-cache",
  });
  const [createCate, { data: dataCreate, loading, error: errorCreate }] =
    useMutation(CREATE_CATEGORY, { fetchPolicy: "no-cache" });
  const [updateCate, { data: dataUpdate, error: errorUpdate }] = useMutation(
    UPDATE_CATEGORY,
    { fetchPolicy: "no-cache" }
  );
  const [{ name, slug }, setNewCate] = useState({
    name: "",
    slug: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "create") {
      await createCate({
        variables: {
          input: {
            name,
            parent_id,
            slug,
            depth,
          },
        },
      }).catch(() => {});
    } else if (type === "update") {
      console.log(slug, name, preload.id);
      await updateCate({
        variables: {
          input: {
            slug,
            name,
            id: parseInt(preload?.id),
          },
        },
      });
    }
  };
  useEffect(() => {
    if (preload?.id >= 0) {
      setNewCate(preload);
    } else setNewCate({ name: "", slug: "" });
  }, [preload]);
  useEffect(() => {
    if (slug.trim() === "") return;
    let a;
    a = setTimeout(() => {
      checkSlug({ variables: { input: slug } });
    }, 200);
    return () => {
      clearTimeout(a);
    };
  }, [slug]);
  useEffect(() => {
    if (dataCreate?.createCategory) {
      onSuccess();
      setNewCate({ name: "", slug: "" });
      onClose();
      return toast("Tạo danh mục thành công.", { type: toast.TYPE.SUCCESS });
    }
    if (errorCreate) {
      return toast("Tạo danh mục thất bại.", { type: toast.TYPE.ERROR });
    }
  }, [dataCreate, onSuccess, errorCreate]);

  useEffect(() => {
    if (dataUpdate) {
      const newCate = dataUpdate?.updateCategory;
      toast("cập nhật thành công!", { type: toast.TYPE.SUCCESS });
      onUpdateCate(newCate);
      onClose();
      return;
    }
    if (errorUpdate) {
      return toast("cập nhật thất bại!", { type: toast.TYPE.ERROR });
    }
  }, [dataUpdate, errorUpdate]);
  const handleChange =
    (key, hasSpace = true) =>
    (e) =>
      setNewCate((old) => ({
        ...old,
        [key]: hasSpace ? e.target.value : e.target.value.replace(" ", "-"),
      }));
  return (
    <div>
      {!on && (
        <span
          title="tạo cate mới"
          style={{ cursor: "pointer" }}
          onClick={onOpen}
        >
          <AddIcon />
        </span>
      )}
      {on && (
        <div className={style.createCateWrapper}>
          <form className={style.formCreateCate} onSubmit={handleSubmit}>
            <div className={style.createCate}>
              <TextField
                label="tên"
                size="small"
                value={name}
                onChange={handleChange("name")}
                type="text"
                required={true}
              />
              <span style={{ marginTop: 5 }}></span>
              <TextField
                label="slug"
                error={
                  dataSlug &&
                  dataSlug?.checkUniqueCategory === false &&
                  preload.slug !== slug
                }
                helperText={
                  dataSlug?.checkUniqueCategory === true
                    ? "slug sử dụng được"
                    : "slug phải unique"
                }
                size="small"
                type="text"
                required={true}
                value={slug}
                onChange={handleChange("slug", false)}
              />
            </div>
            <div className={style.createCateButton}>
              <Button
                disabled={
                  (!dataSlug?.checkUniqueCategory && preload.slug !== slug) ||
                  loading
                }
                type="submit"
                variant="outlined"
                color="primary"
              >
                {type === "create" ? "Tạo" : "Cập nhật"}
              </Button>
              <Button variant="outlined" color="secondary" onClick={onClose}>
                Hủy
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const Item = ({ cate, onSelectCate, checked, onDeleteSuccess, openUpdate }) => {
  const [isEdit, setEdit] = useState(false);
  const [deleteCate, { data: dataDelete }] = useMutation(DELETE_CATEGORY, {
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    if (dataDelete?.deleteCategory === true) {
      onDeleteSuccess(cate.id);
    }
  });
  return (
    <div
      className={className(style.item, { [style.checked]: checked })}
      onClick={() => {
        onSelectCate(cate);
      }}
    >
      <div className={style.cateInfor} title="ấn để chọn category này.">
        <p>{cate.name}</p>
        <p>/{cate.slug}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          onClick={(e) => {
            e.stopPropagation();
            openUpdate();
          }}
        >
          <ModeEditIcon />
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            confirmAlert({
              title: "Bạn chắc chắn muốn xóa?",
              message: "Không thể hoàn tác sau khi xóa!",
              buttons: [
                {
                  label: "Đồng ý",
                  onClick: () =>
                    deleteCate({ variables: { input: parseInt(cate.id) } }),
                },
                {
                  label: "Hủy",
                  onClick: () => {},
                },
              ],
            });
          }}
        >
          <DeleteForeverIcon />
        </span>
      </div>
    </div>
  );
};
