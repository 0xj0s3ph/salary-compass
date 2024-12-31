"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SalaryCalculator = () => {
  // State for base salary range
  const [baseSalaryMin, setBaseSalaryMin] = useState<string>("200000");
  const [baseSalaryMax, setBaseSalaryMax] = useState<string>("400000");

  // State for overtime pay range
  const [overtimeMin, setOvertimeMin] = useState<string>("20000");
  const [overtimeMax, setOvertimeMax] = useState<string>("50000");

  // State for bonus
  const [bonus, setBonus] = useState<string>("");

  // Convert string inputs to numbers, defaulting to 0 if empty
  const baseMin = parseFloat(baseSalaryMin) || 0;
  const baseMax = parseFloat(baseSalaryMax) || 0;
  const overtimeMinAmount = parseFloat(overtimeMin) || 0;
  const overtimeMaxAmount = parseFloat(overtimeMax) || 0;
  const bonusAmount = parseFloat(bonus) || 0;

  // Calculate monthly salary ranges
  const monthlyMin = baseMin + overtimeMinAmount;
  const monthlyMax = baseMax + overtimeMaxAmount;

  // Calculate annual salary including bonus
  const annualMin = monthlyMin * 12 + bonusAmount;
  const annualMax = monthlyMax * 12 + bonusAmount;

  // Calculate hourly rate (assuming 160 working hours per month)
  const hourlyMin = monthlyMin / 160;
  const hourlyMax = monthlyMax / 160;

  // Format numbers with commas and decimals
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format range values
  const formatRange = (min: number, max: number) => {
    return `${formatCurrency(min)} 〜 ${formatCurrency(max)}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>給与計算機</CardTitle>
        <CardDescription>月給と時給を計算します</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label>基本給</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="baseSalaryMin"
                  className="text-sm text-muted-foreground"
                >
                  最小
                </Label>
                <Input
                  id="baseSalaryMin"
                  type="number"
                  placeholder="例: 200000"
                  value={baseSalaryMin}
                  onChange={(e) => setBaseSalaryMin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="baseSalaryMax"
                  className="text-sm text-muted-foreground"
                >
                  最大
                </Label>
                <Input
                  id="baseSalaryMax"
                  type="number"
                  placeholder="例: 400000"
                  value={baseSalaryMax}
                  onChange={(e) => setBaseSalaryMax(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>固定残業代</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="overtimeMin"
                  className="text-sm text-muted-foreground"
                >
                  最小
                </Label>
                <Input
                  id="overtimeMin"
                  type="number"
                  placeholder="例: 20000"
                  value={overtimeMin}
                  onChange={(e) => setOvertimeMin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="overtimeMax"
                  className="text-sm text-muted-foreground"
                >
                  最大
                </Label>
                <Input
                  id="overtimeMax"
                  type="number"
                  placeholder="例: 50000"
                  value={overtimeMax}
                  onChange={(e) => setOvertimeMax(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bonus">賞与 (年間)</Label>
            <Input
              id="bonus"
              type="number"
              placeholder="例: 500000"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
            />
          </div>
        </div>

        {/* Results Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>項目</TableHead>
              <TableHead className="text-right">金額</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>月額給与 (基本給 + 固定残業代)</TableCell>
              <TableCell className="text-right font-medium">
                {formatRange(monthlyMin, monthlyMax)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>時給 (想定労働時間: 月160時間)</TableCell>
              <TableCell className="text-right font-medium">
                {formatRange(hourlyMin, hourlyMax)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>年収 (賞与含む)</TableCell>
              <TableCell className="text-right font-medium">
                {formatRange(annualMin, annualMax)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SalaryCalculator;
