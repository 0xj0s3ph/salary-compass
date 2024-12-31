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
  const [baseSalary, setBaseSalary] = useState<string>("");
  const [overtimePay, setOvertimePay] = useState<string>("");
  const [bonus, setBonus] = useState<string>("");

  // Convert string inputs to numbers, defaulting to 0 if empty
  const baseAmount = parseFloat(baseSalary) || 0;
  const overtimeAmount = parseFloat(overtimePay) || 0;
  const bonusAmount = parseFloat(bonus) || 0;

  // Calculate monthly salary
  const monthlyTotal = baseAmount + overtimeAmount;

  // Calculate annual salary including bonus
  const annualTotal = monthlyTotal * 12 + bonusAmount;

  // Calculate hourly rate (assuming 160 working hours per month)
  const hourlyRate = monthlyTotal / 160;

  // Format numbers with commas and decimals
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>給与計算機</CardTitle>
        <CardDescription>月給と時給を計算します</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="baseSalary">基本給</Label>
            <Input
              id="baseSalary"
              type="number"
              placeholder="例: 250000"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overtimePay">固定残業代</Label>
            <Input
              id="overtimePay"
              type="number"
              placeholder="例: 30000"
              value={overtimePay}
              onChange={(e) => setOvertimePay(e.target.value)}
            />
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
                {formatCurrency(monthlyTotal)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>時給 (想定労働時間: 月160時間)</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(hourlyRate)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>年収 (賞与含む)</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(annualTotal)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SalaryCalculator;
