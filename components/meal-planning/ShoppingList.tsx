import React, { useState } from 'react';
import { ShoppingCart, Copy, CheckCircle } from 'lucide-react';
import { ShoppingSection } from '../../types/mealPlan';

interface ShoppingListProps {
  shoppingList: ShoppingSection[];
  totalCost?: string;
}

export function ShoppingList({ shoppingList, totalCost }: ShoppingListProps) {
  const [copied, setCopied] = useState(false);

  const copyShoppingList = async () => {
    try {
      let listText = "WEEKLY SHOPPING LIST\n\n";
      shoppingList.forEach(section => {
        listText += `${section.section.toUpperCase()}:\n`;
        section.items.forEach(item => {
          listText += `• ${item.item} - ${item.quantity}${item.estimatedCost ? ` (${item.estimatedCost})` : ''}\n`;
        });
        listText += "\n";
      });
      
      if (totalCost) {
        listText += `ESTIMATED TOTAL: ${totalCost}`;
      }

      await navigator.clipboard.writeText(listText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy shopping list:', err);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <ShoppingCart className="h-5 w-5 mr-3 text-green-600" />
          Shopping List
        </h3>
        <div className="flex items-center space-x-3">
          {totalCost && (
            <div className="text-lg font-semibold text-green-600">
              {totalCost}
            </div>
          )}
          <button
            onClick={copyShoppingList}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copy shopping list"
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      
      {/* Shopping List Sections */}
      <div className="space-y-4">
        {shoppingList.map((section, index) => (
          <div key={index}>
            <h4 className="font-medium text-gray-900 mb-2 text-sm uppercase tracking-wide border-b border-gray-300 pb-1">
              {section.section}
            </h4>
            <div className="space-y-1">
              {section.items.map((item, i) => (
                <div 
                  key={i} 
                  className="flex justify-between items-center text-sm bg-white rounded-lg px-3 py-2 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-gray-900 font-medium">{item.item}</span>
                    <span className="text-gray-500 ml-2">({item.quantity})</span>
                  </div>
                  {item.estimatedCost && (
                    <span className="text-green-600 font-medium text-right">
                      {item.estimatedCost}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Total Section */}
      {totalCost && (
        <div className="mt-6 pt-4 border-t border-gray-300">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900">Estimated Total:</span>
            <span className="text-lg font-bold text-green-600">{totalCost}</span>
          </div>
        </div>
      )}

      {/* Copy Success Message */}
      {copied && (
        <div className="mt-3 p-2 bg-green-100 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm text-center">
            ✓ Shopping list copied to clipboard!
          </p>
        </div>
      )}
    </div>
  );
}