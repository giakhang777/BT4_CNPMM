// src/pages/products.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Col, Empty, Pagination, Row, Select, Skeleton, notification } from "antd";
import { getCategoriesApi, getProductsPagedApi } from "../util/api.js";

const PAGE_SIZE = 4; // ✅ mỗi trang 4 card

function ProductCard({ p }) {
  return (
    <Card
      className="product-card"
      hoverable
      cover={
        p.imageUrl ? (
          <img className="product-img" alt={p.name} src={p.imageUrl} loading="lazy" />
        ) : null
      }
    >
      <div className="product-title" title={p.name}>{p.name}</div>
      <div className="product-price">
        {Intl.NumberFormat("vi-VN").format(p.price)} đ
      </div>
    </Card>
  );
}

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(undefined);
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ items: [], totalItems: 0, totalPages: 0, loading: false });

  // load categories
  useEffect(() => {
    (async () => {
      const res = await getCategoriesApi();
      if (res?.EC === 0) {
        const cats = res.DT || [];
        setCategories(cats);
        if (cats.length) setActiveCat(String(cats[0].id));
      } else {
        notification.error({ message: "Categories", description: res?.EM || "Load categories failed" });
      }
    })();
  }, []);

  const currentCategoryId = useMemo(
    () => (activeCat ? Number(activeCat) : undefined),
    [activeCat]
  );

  const fetchPage = useCallback(
    async (p) => {
      setState((s) => ({ ...s, loading: true }));
      const res = await getProductsPagedApi(currentCategoryId, p, PAGE_SIZE); // ✅ limit=4
      if (res?.EC === 0) {
        const { items, totalItems, totalPages } = res.DT || {};
        setState({ items: items || [], totalItems, totalPages, loading: false });
      } else {
        notification.error({ message: "Products", description: res?.EM || "Fetch failed" });
        setState((s) => ({ ...s, loading: false }));
      }
    },
    [currentCategoryId]
  );

  // đổi danh mục → về trang 1
  useEffect(() => {
    if (currentCategoryId === undefined) return;
    setPage(1);
    fetchPage(1);
  }, [currentCategoryId, fetchPage]);

  return (
    <div className="container">
      <h2>Products</h2>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <span>Danh mục:</span>
        <Select
          value={activeCat}
          style={{ minWidth: 240 }}
          options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
          onChange={setActiveCat}
        />
      </div>

      {!activeCat && <Empty />}

      {activeCat && (
        <>
          <Row gutter={[16, 16]}>
            {(state.loading ? Array.from({ length: PAGE_SIZE }) : state.items).map((p, i) => (
              <Col xs={24} sm={12} md={8} lg={6} key={p?.id || i}>
                {state.loading ? <Skeleton active /> : <ProductCard p={p} />}
              </Col>
            ))}
          </Row>

          {!state.loading && state.items.length === 0 && <Empty style={{ marginTop: 24 }} />}

          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}                 // ✅ 4 card/trang
              total={state.totalItems}
              onChange={(p) => { setPage(p); fetchPage(p); }}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
