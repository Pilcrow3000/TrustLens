"use client"

import { useState, useCallback, useMemo } from "react"
import {
  Upload,
  FileUp,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronRight,
  Loader2,
  Database,
  Search,
  ExternalLink,
  Star,
  Download,
  Tag,
  X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* ──── Static data ──── */

const supportedFormats = [
  { ext: ".pkl", label: "Scikit-learn", desc: "Pickle serialized models" },
  { ext: ".pt", label: "PyTorch", desc: "PyTorch model state" },
  { ext: ".h5", label: "Keras/TF", desc: "HDF5 model format" },
  { ext: ".onnx", label: "ONNX", desc: "Open Neural Network Exchange" },
  { ext: ".joblib", label: "Joblib", desc: "Joblib serialized models" },
  { ext: ".pmml", label: "PMML", desc: "Predictive Model Markup Language" },
  { ext: ".cbm", label: "CatBoost", desc: "CatBoost binary model" },
  { ext: ".xgb", label: "XGBoost", desc: "XGBoost binary model" },
]

const auditModules = [
  { id: "explainability", label: "Explainability (SHAP)", enabled: true },
  { id: "fairness", label: "Bias & Fairness", enabled: true },
  { id: "robustness", label: "Robustness Testing", enabled: true },
  { id: "drift", label: "Drift Detection", enabled: true },
  { id: "calibration", label: "Confidence Calibration", enabled: true },
]

type DatasetSource =
  | "UCI Machine Learning Repository"
  | "Kaggle Datasets"
  | "OpenML"
  | "Hugging Face Datasets"
  | "TensorFlow Datasets"
  | "Keras Built-in"
  | "Scikit-learn Built-in"
  | "Government / Open Data"
  | "Custom Upload"

interface Dataset {
  id: string
  name: string
  source: DatasetSource
  category: string
  rows: string
  features: string
  task: string
  description: string
  popularity: number // 1–5
  license: string
  url: string
}

const allDatasets: Dataset[] = [
  // UCI
  { id: "uci-adult", name: "Adult Income (Census)", source: "UCI Machine Learning Repository", category: "Tabular", rows: "48,842", features: "14", task: "Classification", description: "Predict whether income exceeds $50K/yr based on census data. Common for fairness/bias auditing.", popularity: 5, license: "CC BY 4.0", url: "https://archive.ics.uci.edu/dataset/2/adult" },
  { id: "uci-heart", name: "Heart Disease", source: "UCI Machine Learning Repository", category: "Healthcare", rows: "303", features: "13", task: "Classification", description: "Predict presence of heart disease from clinical attributes.", popularity: 4, license: "CC BY 4.0", url: "https://archive.ics.uci.edu/dataset/45/heart+disease" },
  { id: "uci-wine", name: "Wine Quality", source: "UCI Machine Learning Repository", category: "Tabular", rows: "6,497", features: "12", task: "Classification / Regression", description: "Predict wine quality score from physicochemical properties.", popularity: 4, license: "CC BY 4.0", url: "https://archive.ics.uci.edu/dataset/186/wine+quality" },
  { id: "uci-bank", name: "Bank Marketing", source: "UCI Machine Learning Repository", category: "Finance", rows: "45,211", features: "16", task: "Classification", description: "Predict if a client subscribes to a bank term deposit.", popularity: 4, license: "CC BY 4.0", url: "https://archive.ics.uci.edu/dataset/222/bank+marketing" },
  { id: "uci-abalone", name: "Abalone Age Prediction", source: "UCI Machine Learning Repository", category: "Tabular", rows: "4,177", features: "8", task: "Regression", description: "Predict the age of abalone from physical measurements.", popularity: 3, license: "CC BY 4.0", url: "https://archive.ics.uci.edu/dataset/1/abalone" },

  // Kaggle
  { id: "kaggle-churn", name: "Telco Customer Churn", source: "Kaggle Datasets", category: "Business", rows: "7,043", features: "21", task: "Classification", description: "Predict customer churn for a telecom company. Popular for retention modeling.", popularity: 5, license: "Apache 2.0", url: "https://www.kaggle.com/datasets/blastchar/telco-customer-churn" },
  { id: "kaggle-titanic", name: "Titanic Survival", source: "Kaggle Datasets", category: "Tabular", rows: "891", features: "12", task: "Classification", description: "Classic introductory dataset: predict passenger survival on the Titanic.", popularity: 5, license: "Public Domain", url: "https://www.kaggle.com/c/titanic" },
  { id: "kaggle-housing", name: "House Prices (Ames)", source: "Kaggle Datasets", category: "Real Estate", rows: "1,460", features: "79", task: "Regression", description: "Predict house sale prices from 79 explanatory variables.", popularity: 5, license: "Public Domain", url: "https://www.kaggle.com/c/house-prices-advanced-regression-techniques" },
  { id: "kaggle-credit", name: "Credit Card Fraud", source: "Kaggle Datasets", category: "Finance", rows: "284,807", features: "30", task: "Anomaly Detection", description: "Highly imbalanced dataset of credit card transactions for fraud detection.", popularity: 5, license: "DbCL v1.0", url: "https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud" },
  { id: "kaggle-spam", name: "SMS Spam Collection", source: "Kaggle Datasets", category: "NLP", rows: "5,572", features: "2", task: "Text Classification", description: "Classify SMS messages as spam or ham.", popularity: 3, license: "Public Domain", url: "https://www.kaggle.com/datasets/uciml/sms-spam-collection-dataset" },

  // OpenML
  { id: "openml-diabetes", name: "Pima Indians Diabetes", source: "OpenML", category: "Healthcare", rows: "768", features: "8", task: "Classification", description: "Predict onset of diabetes from diagnostic measurements.", popularity: 4, license: "CC BY 4.0", url: "https://www.openml.org/d/37" },
  { id: "openml-german", name: "German Credit Risk", source: "OpenML", category: "Finance", rows: "1,000", features: "20", task: "Classification", description: "Classify credit applicants as good or bad risk. Classic fairness dataset.", popularity: 4, license: "CC BY 4.0", url: "https://www.openml.org/d/31" },
  { id: "openml-electricity", name: "Electricity Pricing", source: "OpenML", category: "Energy", rows: "45,312", features: "8", task: "Classification", description: "Predict electricity price direction (up/down) from market data.", popularity: 3, license: "CC BY 4.0", url: "https://www.openml.org/d/151" },

  // Hugging Face
  { id: "hf-imdb", name: "IMDB Reviews", source: "Hugging Face Datasets", category: "NLP", rows: "50,000", features: "2", task: "Sentiment Analysis", description: "Large Movie Review Dataset for binary sentiment classification.", popularity: 5, license: "Apache 2.0", url: "https://huggingface.co/datasets/imdb" },
  { id: "hf-ag-news", name: "AG News", source: "Hugging Face Datasets", category: "NLP", rows: "120,000", features: "2", task: "Text Classification", description: "News articles categorized into 4 topics: World, Sports, Business, Sci/Tech.", popularity: 4, license: "MIT", url: "https://huggingface.co/datasets/ag_news" },
  { id: "hf-squad", name: "SQuAD 2.0", source: "Hugging Face Datasets", category: "NLP", rows: "130,319", features: "4", task: "Question Answering", description: "Stanford Question Answering Dataset for reading comprehension.", popularity: 5, license: "CC BY-SA 4.0", url: "https://huggingface.co/datasets/squad_v2" },

  // TensorFlow Datasets
  { id: "tfds-cifar10", name: "CIFAR-10", source: "TensorFlow Datasets", category: "Computer Vision", rows: "60,000", features: "3072 px", task: "Image Classification", description: "60K 32x32 color images in 10 classes, 6K images per class.", popularity: 5, license: "MIT", url: "https://www.tensorflow.org/datasets/catalog/cifar10" },
  { id: "tfds-mnist", name: "MNIST Handwritten Digits", source: "TensorFlow Datasets", category: "Computer Vision", rows: "70,000", features: "784 px", task: "Image Classification", description: "The classic handwritten digit recognition benchmark.", popularity: 5, license: "CC BY-SA 3.0", url: "https://www.tensorflow.org/datasets/catalog/mnist" },
  { id: "tfds-fashion", name: "Fashion MNIST", source: "TensorFlow Datasets", category: "Computer Vision", rows: "70,000", features: "784 px", task: "Image Classification", description: "Zalando article images as a drop-in replacement for MNIST.", popularity: 4, license: "MIT", url: "https://www.tensorflow.org/datasets/catalog/fashion_mnist" },

  // Keras Built-in
  { id: "keras-boston", name: "Boston Housing", source: "Keras Built-in", category: "Real Estate", rows: "506", features: "13", task: "Regression", description: "Predict median home values in Boston suburbs.", popularity: 3, license: "Public Domain", url: "https://keras.io/api/datasets/" },
  { id: "keras-reuters", name: "Reuters Newswire", source: "Keras Built-in", category: "NLP", rows: "11,228", features: "Tokenized", task: "Multi-label Classification", description: "Newswire articles classified into 46 topic categories.", popularity: 3, license: "Public Domain", url: "https://keras.io/api/datasets/" },

  // Scikit-learn Built-in
  { id: "sklearn-iris", name: "Iris Flowers", source: "Scikit-learn Built-in", category: "Tabular", rows: "150", features: "4", task: "Classification", description: "The classic Iris species classification dataset by Fisher.", popularity: 5, license: "Public Domain", url: "https://scikit-learn.org/stable/datasets/toy_dataset.html" },
  { id: "sklearn-breast", name: "Breast Cancer Wisconsin", source: "Scikit-learn Built-in", category: "Healthcare", rows: "569", features: "30", task: "Classification", description: "Classify tumors as malignant or benign from cell nuclei features.", popularity: 4, license: "Public Domain", url: "https://scikit-learn.org/stable/datasets/toy_dataset.html" },
  { id: "sklearn-digits", name: "Optical Digits", source: "Scikit-learn Built-in", category: "Computer Vision", rows: "1,797", features: "64", task: "Classification", description: "Handwritten digits 0-9 in 8x8 grayscale images.", popularity: 3, license: "Public Domain", url: "https://scikit-learn.org/stable/datasets/toy_dataset.html" },

  // Government / Open Data
  { id: "gov-compas", name: "COMPAS Recidivism", source: "Government / Open Data", category: "Criminal Justice", rows: "7,214", features: "14", task: "Classification", description: "Predict recidivism risk. Widely used for algorithmic fairness research.", popularity: 5, license: "Public Domain", url: "https://github.com/propublica/compas-analysis" },
  { id: "gov-lending", name: "Lending Club Loans", source: "Government / Open Data", category: "Finance", rows: "2.2M+", features: "150+", task: "Classification / Regression", description: "Loan data including status, amount, rates. Great for credit risk modeling.", popularity: 4, license: "Public Domain", url: "https://www.lendingclub.com/info/download-data.action" },
  { id: "gov-nih-chest", name: "NIH Chest X-rays", source: "Government / Open Data", category: "Medical Imaging", rows: "112,120", features: "Image", task: "Multi-label Classification", description: "Chest X-ray images with 15 disease labels. Large-scale medical imaging benchmark.", popularity: 4, license: "CC0 1.0", url: "https://nihcc.app.box.com/v/ChestXray-NIHCC" },
]

const sources: DatasetSource[] = [
  "Kaggle Datasets",
  "UCI Machine Learning Repository",
  "OpenML",
  "Hugging Face Datasets",
  "TensorFlow Datasets",
  "Keras Built-in",
  "Scikit-learn Built-in",
  "Government / Open Data",
  "Custom Upload",
]

const categories = [
  "All",
  "Tabular",
  "Finance",
  "Healthcare",
  "NLP",
  "Computer Vision",
  "Business",
  "Real Estate",
  "Medical Imaging",
  "Energy",
  "Criminal Justice",
]

const tasks = [
  "All",
  "Classification",
  "Regression",
  "Sentiment Analysis",
  "Image Classification",
  "Anomaly Detection",
  "Text Classification",
  "Question Answering",
  "Multi-label Classification",
]

/* ──── Component ──── */

export function UploadContent() {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [modules, setModules] = useState(auditModules)

  // Dataset state
  const [datasetSource, setDatasetSource] = useState<DatasetSource | "all">("all")
  const [datasetCategory, setDatasetCategory] = useState("All")
  const [datasetTask, setDatasetTask] = useState("All")
  const [datasetSearch, setDatasetSearch] = useState("")
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)

  // Step tracking
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const filteredDatasets = useMemo(() => {
    return allDatasets.filter((ds) => {
      if (datasetSource !== "all" && ds.source !== datasetSource) return false
      if (datasetCategory !== "All" && ds.category !== datasetCategory) return false
      if (datasetTask !== "All" && !ds.task.includes(datasetTask)) return false
      if (datasetSearch) {
        const q = datasetSearch.toLowerCase()
        return (
          ds.name.toLowerCase().includes(q) ||
          ds.description.toLowerCase().includes(q) ||
          ds.source.toLowerCase().includes(q) ||
          ds.category.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [datasetSource, datasetCategory, datasetTask, datasetSearch])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }, [])

  const toggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    )
  }

  const handleUpload = () => {
    setUploading(true)
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[
            { num: 1, label: "Upload Model" },
            { num: 2, label: "Select Dataset" },
            { num: 3, label: "Configure & Start" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <button
                onClick={() => setStep(s.num as 1 | 2 | 3)}
                className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  step === s.num
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : step > s.num
                      ? "bg-primary/5 text-primary/70 border border-primary/10"
                      : "bg-secondary/30 text-muted-foreground border border-border"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    step > s.num
                      ? "bg-primary text-primary-foreground"
                      : step === s.num
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < 2 && (
                <div className={`w-8 h-px ${step > s.num ? "bg-primary/40" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Upload Model ── */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Model File</CardTitle>
                <CardDescription>
                  Drag and drop your trained model file or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : file
                        ? "border-primary/40 bg-primary/5"
                        : "border-border hover:border-muted-foreground/40 hover:bg-secondary/20"
                  }`}
                >
                  {file ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium font-mono text-foreground">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setFile(null)}
                      >
                        Remove & Upload Different File
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-secondary/40 flex items-center justify-center">
                        <FileUp className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Drop your model file here
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          or click to browse your files
                        </p>
                      </div>
                      <label>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pkl,.pt,.h5,.onnx,.joblib,.pmml,.cbm,.xgb"
                          onChange={handleFileSelect}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border text-foreground hover:bg-secondary cursor-pointer"
                          asChild
                        >
                          <span>Browse Files</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>

                {uploading && (
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Uploading and validating...
                      </span>
                      <span className="text-xs font-mono text-primary">
                        {Math.min(Math.round(uploadProgress), 100)}%
                      </span>
                    </div>
                    <Progress value={Math.min(uploadProgress, 100)} className="h-2" />
                  </div>
                )}

                {/* Model metadata */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="model-name" className="text-sm text-foreground">
                      Model Name
                    </Label>
                    <Input
                      id="model-name"
                      placeholder="e.g. credit_risk_v3"
                      className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="model-framework" className="text-sm text-foreground">
                      Framework
                    </Label>
                    <Select>
                      <SelectTrigger id="model-framework" className="bg-secondary/20 border-border text-foreground">
                        <SelectValue placeholder="Auto-detect" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sklearn">Scikit-learn</SelectItem>
                        <SelectItem value="pytorch">PyTorch</SelectItem>
                        <SelectItem value="tensorflow">TensorFlow / Keras</SelectItem>
                        <SelectItem value="onnx">ONNX</SelectItem>
                        <SelectItem value="xgboost">XGBoost</SelectItem>
                        <SelectItem value="catboost">CatBoost</SelectItem>
                        <SelectItem value="lightgbm">LightGBM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!file}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  >
                    Next: Select Dataset
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Supported Formats sidebar */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Supported Formats</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {supportedFormats.map((format) => (
                  <div
                    key={format.ext}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/20 border border-border"
                  >
                    <Badge
                      variant="outline"
                      className="font-mono text-[11px] border-primary/30 text-primary"
                    >
                      {format.ext}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{format.label}</p>
                      <p className="text-[10px] text-muted-foreground">{format.desc}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Maximum file size is 500MB. Models should be serialized
                      in their native framework format.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Step 2: Select Dataset ── */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            {/* Filters bar */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search datasets by name, description, or source..."
                        value={datasetSearch}
                        onChange={(e) => setDatasetSearch(e.target.value)}
                        className="pl-9 bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    {/* Source filter */}
                    <Select
                      value={datasetSource}
                      onValueChange={(v) => setDatasetSource(v as DatasetSource | "all")}
                    >
                      <SelectTrigger className="w-full sm:w-56 bg-secondary/20 border-border text-foreground">
                        <SelectValue placeholder="All Sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        {sources.filter((s) => s !== "Custom Upload").map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category + Task pills */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
                      <Tag className="w-3 h-3" /> Category:
                    </span>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setDatasetCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          datasetCategory === cat
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "bg-secondary/30 text-muted-foreground border border-border hover:bg-secondary/50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
                      <Database className="w-3 h-3" /> Task:
                    </span>
                    {tasks.map((t) => (
                      <button
                        key={t}
                        onClick={() => setDatasetTask(t)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          datasetTask === t
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "bg-secondary/30 text-muted-foreground border border-border hover:bg-secondary/50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Active filters summary */}
                  {(datasetSource !== "all" || datasetCategory !== "All" || datasetTask !== "All" || datasetSearch) && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-muted-foreground">
                        {filteredDatasets.length} of {allDatasets.length} datasets
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
                        onClick={() => {
                          setDatasetSource("all")
                          setDatasetCategory("All")
                          setDatasetTask("All")
                          setDatasetSearch("")
                        }}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear filters
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dataset list */}
            <div className="grid grid-cols-1 gap-3">
              <ScrollArea className="h-[520px] pr-1">
                <RadioGroup
                  value={selectedDataset?.id ?? ""}
                  onValueChange={(val) => {
                    const ds = allDatasets.find((d) => d.id === val)
                    setSelectedDataset(ds ?? null)
                  }}
                  className="flex flex-col gap-3"
                >
                  {filteredDatasets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Database className="w-10 h-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm text-muted-foreground">No datasets match your filters</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  ) : (
                    filteredDatasets.map((ds) => (
                      <label
                        key={ds.id}
                        className={`relative flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedDataset?.id === ds.id
                            ? "border-primary/40 bg-primary/5"
                            : "border-border bg-card hover:bg-secondary/20 hover:border-muted-foreground/30"
                        }`}
                      >
                        <RadioGroupItem value={ds.id} className="mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-foreground">
                                  {ds.name}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] border-primary/20 text-primary/80"
                                >
                                  {ds.source}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] border-border text-muted-foreground"
                                >
                                  {ds.category}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                                {ds.description}
                              </p>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a
                                  href={ds.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label={`View ${ds.name} source`}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>View source</TooltipContent>
                            </Tooltip>
                          </div>

                          {/* Meta row */}
                          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2.5">
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {ds.rows} rows
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {ds.features} features
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] border-border text-muted-foreground"
                            >
                              {ds.task}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground">{ds.license}</span>
                            <span className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-2.5 h-2.5 ${
                                    i < ds.popularity
                                      ? "text-primary fill-primary"
                                      : "text-border"
                                  }`}
                                />
                              ))}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </RadioGroup>
              </ScrollArea>
            </div>

            {/* Or upload custom dataset */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/40 flex items-center justify-center flex-shrink-0">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Have your own dataset?
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Upload a CSV, Parquet, or JSON file to use as the evaluation dataset for your audit.
                    </p>
                  </div>
                  <label>
                    <input type="file" className="hidden" accept=".csv,.parquet,.json,.jsonl" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:bg-secondary cursor-pointer"
                      asChild
                    >
                      <span>Upload Dataset</span>
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Nav buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="border-border text-foreground hover:bg-secondary"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedDataset}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                Next: Configure Audit
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Configure & Start ── */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Model Summary */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-base flex items-center gap-2">
                    <FileUp className="w-4 h-4 text-primary" />
                    Model File
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 rounded-lg bg-secondary/20 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium font-mono text-foreground">
                          {file ? file.name : "No file selected"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {file
                            ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                            : "Go back to step 1"}
                        </p>
                      </div>
                      {file ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dataset Summary */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-base flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    Evaluation Dataset
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 rounded-lg bg-secondary/20 border border-border">
                    {selectedDataset ? (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground">
                            {selectedDataset.name}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-[10px] border-primary/20 text-primary/80"
                          >
                            {selectedDataset.source}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{selectedDataset.rows} rows</span>
                          <span>{selectedDataset.features} features</span>
                          <span>{selectedDataset.task}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">No dataset selected</p>
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Audit Modules */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Audit Modules</CardTitle>
                <CardDescription>
                  Select which audit dimensions to evaluate. All modules are enabled by default.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {modules.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border text-left transition-all ${
                        mod.enabled
                          ? "border-primary/30 bg-primary/5"
                          : "border-border bg-secondary/10 opacity-60"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          mod.enabled
                            ? "bg-primary border-primary"
                            : "border-border"
                        }`}
                      >
                        {mod.enabled && (
                          <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {mod.label}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Modules Badges */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Active Modules</p>
              <div className="flex flex-wrap gap-2">
                {modules
                  .filter((m) => m.enabled)
                  .map((m) => (
                    <Badge
                      key={m.id}
                      variant="outline"
                      className="border-primary/30 text-primary text-xs"
                    >
                      {m.label}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="border-border text-foreground hover:bg-secondary"
              >
                Back
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || !selectedDataset || uploading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running Audit...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Start Audit
                    <ChevronRight className="w-3 h-3" />
                  </>
                )}
              </Button>
            </div>

            {uploading && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Uploading model and loading dataset...
                  </span>
                  <span className="text-xs font-mono text-primary">
                    {Math.min(Math.round(uploadProgress), 100)}%
                  </span>
                </div>
                <Progress value={Math.min(uploadProgress, 100)} className="h-2" />
              </div>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
