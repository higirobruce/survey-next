"use client";
import { useState, useEffect } from "react";
import {
  Radio,
  Button,
  Space,
  Input,
  message,
  Typography,
  Card,
  Statistic,
  Skeleton,
} from "antd";

import { ReloadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const Survey = ({ onSubmit }) => {
  const userAgent = typeof window !== "undefined" && window.navigator.userAgent;
  const platform = typeof window !== "undefined" && window.navigator.platform;

  const [ranking, setRanking] = useState(0);
  const [value, setValue] = useState("Good 😊");
  const [code, setCode] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [results, setResults] = useState([]);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    handleGetResults();
  }, []);
  const handleRankingChange = (e) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    // alert(value);
    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BCKEND_URL}/survey`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ranking: {
              rank: value,
              code,
              device: userAgent,
            },
          }),
        }
      );

      if (response.ok) {
        message.success("Survey response added successfully", 5);
      } else {
        let res = await response.json();
        console.log(res);
        message.error(res.message, 5);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setValue(null);
      setCode(null);
      setSubmitting(false);
    }
  };

  const handleGetResults = async (e) => {
    setLoadingResults(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BCKEND_URL}/survey/summary`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const results_ = await response.json();
        setResults(results_);

        let _total = 0;

        results_?.map((r) => {
          _total += r?.total;
        });

        setTotal(_total);
      }
    } catch (err) {
    } finally {
      setLoadingResults(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
        type: "tween",
        ease: "circOut",
      }}
    >
      {contextHolder}
      <div className="flex flex-col space-y-4">
        <Typography.Title level={2}>
          Rank Intare Conference Arena
        </Typography.Title>

        <Input
          placeholder="Code (4 digits)"
          value={code}
          prefix="Voting Code: "
          onChange={(e) => {
            console.log(e.target.value);
            setCode(e.target.value);
          }}
        />

        <Radio.Group onChange={handleRankingChange} value={value}>
          <Space direction="vertical">
            <Radio value="Mediocre 😝">Mediocre 😝</Radio>
            <Radio value="Not bad 😕">Not bad 😕</Radio>
            <Radio value="Good 😊">Good 😊</Radio>
            <Radio value="Excellent 🤩">Excellent 🤩</Radio>
          </Space>
        </Radio.Group>

        <Button
          type="primary"
          onClick={handleSubmit}
          loading={submitting}
          disabled={!code || !value}
        >
          Submit
        </Button>
      </div>

      <div className="flex flex-col mt-10">
        <div className="flex flex-row justify-between items-center">
          <Typography.Title level={2}>Results </Typography.Title>

          <ReloadOutlined onClick={handleGetResults} />
        </div>
        {!loadingResults && (
          <div className="grid grid-cols-2 gap-3">
            <Card bordered={true}>
              <Statistic
                title="Mediocre 😝"
                precision={2}
                value={
                  (results.filter((r) => r._id == "Mediocre 😝")[0]?.total /
                    total) *
                    100 || 0
                }
                valueStyle={{ color: "#0096FF" }}
                // prefix={<ArrowDownOutlined />}
                suffix="%"
              />
            </Card>
            <Card bordered={true}>
              <Statistic
                title="Not bad 😕"
                value={
                  (results.filter((r) => r._id == "Not bad 😕")[0]?.total /
                    total) *
                    100 || 0
                }
                valueStyle={{ color: "#0096FF" }}
                // prefix={<ArrowDownOutlined />}
                suffix="%"
                precision={2}
              />
            </Card>
            <Card bordered={true}>
              <Statistic
                title="Good 😊"
                value={
                  (results.filter((r) => r._id == "Good 😊")[0]?.total /
                    total) *
                    100 || 0
                }
                valueStyle={{ color: "#0096FF" }}
                // prefix={<ArrowDownOutlined />}
                suffix="%"
                precision={2}
              />
            </Card>
            <Card bordered={true}>
              <Statistic
                title="Excellent 🤩"
                value={
                  (results.filter((r) => r._id == "Excellent 🤩")[0]?.total /
                    total) *
                    100 || 0
                }
                valueStyle={{ color: "#0096FF" }}
                // prefix={<ArrowDownOutlined />}
                suffix="%"
                precision={2}
              />
            </Card>
          </div>
        )}
        {loadingResults && <Skeleton active />}
      </div>
    </motion.div>
  );
};

export default Survey;
