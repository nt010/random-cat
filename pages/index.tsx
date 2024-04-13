import { NextPage } from "next";
import { useEffect, useState } from "react";

const IndexPage: NextPage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // useEffectには非同期関数は渡せない
  useEffect(() => {
    fetchImage().then((newImage) => {
      setImageUrl(newImage.url);
      setLoading(false);
    });
  }, []);

  const handleClick = async () => {
    setLoading(true);
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  }

  return (
    <>
      <button onClick={handleClick}>他のにゃんこも見る</button>
      <div>{loading || <img src={imageUrl} alt="猫画像" />}</div>
    </>
  );
};
export default IndexPage;

type Image = {
  url: string;
}

const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  // レスポンスのボディーをJSONとしてパースし、JavaScriptのオブジェクトとして取得
  const images: unknown = await res.json();
  const image: unknown = images[0];

  // 型ガード関数
  const isImage = (value: unknown): value is Image => {
    // 値がオブジェクトか
    if (!value || typeof value !== "object") {
      return false;
    }
    // urlプロパティが存在、それが文字列か
    return "url" in value && typeof value.url === "string";
  };

  // Imageの構造かチェック
  if (!isImage(image)) {
    throw new Error("猫の画像が取得できませんでした");
  }
  // 配列かチェック
  if (!Array.isArray(images)) {
    throw new Error("猫の画像が取得できませんでした");
  }

  console.log(images);
  return images[0];
}
